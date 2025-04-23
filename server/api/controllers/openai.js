const WebSocket = require('ws');
const { binaryStringToArrayBuffer, concat2ArrayBuffers, concatArrayBuffers, createWavHeader } = require('../helpers/audio.buffer')
const OPENAI_MODEL = 'gpt-4o-realtime-preview-2024-10-01'


exports.get = async (req, res) => {
    return res.status(200).json({});
}

exports.websocket = (ws, req) => {
    try {
        const openAiWs = new WebSocket(`wss://api.openai.com/v1/realtime?model=${OPENAI_MODEL}`, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API}`,
                "OpenAI-Beta": "realtime=v1"
            }
        });

        // Handle Messages Coming from Client
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                const isAudio = data.event == 'media' && openAiWs.readyState === WebSocket.OPEN
                if (isAudio) sendAudio(openAiWs, data)
                else if (data.event == 'text') sendMessage(openAiWs, data.message)
            } catch (error) {
                console.error('Error parsing message:', error, 'Message:', message);
            }
        });

        // Handle Messages Coming from OpenAI
        let audioBuffers = [];
        openAiWs.on('message', async (data) => {
            try {
                const response = JSON.parse(data);

                // Rate Limits
                if (response.type === 'rate_limits.updated' && response.rate_limits) {
                    console.log('Rate Limit:', response.event_id)
                    console.log(response.rate_limits.map(r => `${r.name}: ${r.remaining} of ${r.limit}`).join("\n"))

                    // There is also "requests" out of 100 
                    const ratelimit = response.rate_limits.find(r => r.name == 'tokens');
                    const token = parseInt(ratelimit.remaining);
                    const limit = parseInt(ratelimit.limit);
                    const usage = limit - token;
                    console.log('Usage (Tokens):', usage);
                }

                if (response.type === 'response.audio.delta' && response.delta) {

                    // Base64 to Binary String
                    // (audio delta from OpenAI) Base64 PCM16 → binary (String)… You can use atob()
                    const bs = atob(response.delta);

                    // Binary String to Array Buffer
                    // Binary string → ArrayBuffer (ChatGPT can write you a function)
                    const ab = binaryStringToArrayBuffer(bs);

                    // push to audio buffer list
                    audioBuffers.push(ab);

                }

                // Transcription Done
                if (response.type == 'response.audio_transcript.done') {
                    console.log('OpenAI Says:', response.transcript);
                    ws.send(JSON.stringify({ type: 'text', message: response.transcript }))
                }

                // Function Call from Open AI
                if (response.type === 'response.function_call_arguments.done') console.log(JSON.parse(response.arguments))

                // When response is done
                if (response.type == 'response.done' && response.response.status) {

                    // Failed Response
                    if (response.response.status == 'failed') console.error(response.response.status_details.error.message);

                    /**
                     * Read this to know where I go this from.
                     * https://community.openai.com/t/playing-audio-in-js-sent-from-realtime-api/970917/5
                     */

                    // Concat wavHeader ArrayBuffer + PCM16 ArrayBuffer created in step 2
                    const buffers = concatArrayBuffers(audioBuffers);

                    // Audio Settings
                    const sampleRate = 24000;  // 24 kHz
                    const numChannels = 1;     // Mono
                    const bitsPerSample = 16;  // 16-bit audio
                    // const dataSize =  48000;    // Example: size of audio data in bytes - This affects the length of theaudio
                    const dataSize = parseInt(buffers.byteLength * 1.4);

                    // Create wavHeader ArrayBuffer (ChatGPT can write you a function… I used 24000 samplingRate)
                    const wavHeader = createWavHeader(sampleRate, numChannels, bitsPerSample, dataSize);

                    // Combine 2 buffers
                    const buffer = concat2ArrayBuffers(wavHeader, buffers);

                    ws.send(buffer);

                    // reset array
                    audioBuffers = [];
                }


            } catch (error) {
                console.error('Error processing OpenAI message:', error, 'Raw message:', data);
            }
        });


        // Initialize Session when web socket connects
        openAiWs.on('open', () => {
            console.log('Connected to the OpenAI Realtime API');
            initializeSession(openAiWs);
        });

        // Handle connection close
        ws.on('close', () => {
            console.log('Client disconnected.');
            if (openAiWs.readyState === WebSocket.OPEN) openAiWs.close();
        });

        // Handle WebSocket close and errors
        openAiWs.on('close', () => console.log('Disconnected from the OpenAI Realtime API'));
        openAiWs.on('error', (error) => console.error('Error in the OpenAI WebSocket:', error));

    } catch (e) {
        console.error(e);
    }
}


// https://platform.openai.com/docs/api-reference/realtime-server-events/session/updated
/**
 * Initializes a session with the OpenAI Realtime API with the given instructions and greeting.
 * @function initializeSession
 * @memberOf module:api/controllers/openai
 * @param {WebSocket} openAiWs - The WebSocket connection to the OpenAI Realtime API.
 * @param {string} [instructions="You are a friend assistant"] - The instructions that will be given to the AI.
 * @param {string} [greeting="Hello there"] - The greeting that will be sent as the first message in the conversation.
 * @example
 * const openAiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
 *    headers: {
 *        Authorization: `Bearer ${OPENAI_API_KEY}`,
 *        "OpenAI-Beta": "realtime=v1"
 *    }
 * });
 * initializeSession(openAiWs, 'You are a friend assistant', 'Hello there');
 */
function initializeSession(openAiWs, instructions = 'You are a friend assistant', greeting = "Hello there") {
    const sessionUpdate = {
        type: 'session.update',
        session: {
            turn_detection: { type: 'server_vad' },
            input_audio_format: 'pcm16',// 'g711_ulaw',
            output_audio_format: 'pcm16',//  'g711_ulaw',
            voice: 'alloy',
            instructions: instructions,
            modalities: ["text", "audio"],
            model: OPENAI_MODEL,
            temperature: 0.8,
            tools: [], // -> this with "tool_choice" scrambles the audio
            tool_choice: "auto",
            max_response_output_tokens: "inf", // Between 1 and 4096 or 'inf'
        }
    };

    console.log('Sending session update:');
    openAiWs.send(JSON.stringify(sessionUpdate));

    if (greeting) {
        const initialConversationItem = {
            type: 'conversation.item.create',
            item: {
                type: 'message',
                role: 'user',
                content: [
                    {
                        type: 'input_text',
                        text: greeting
                    }
                ]
            }
        };
        openAiWs.send(JSON.stringify(initialConversationItem));
        openAiWs.send(JSON.stringify({ type: 'response.create' }));
    }

};


/**
 * Sends a message to the OpenAI Realtime API to simulate a user sending a message in the conversation.
 * @function sendMessage
 * @memberOf module:api/controllers/openai
 * @param {WebSocket} openAiWs - The WebSocket connection to the OpenAI Realtime API.
 * @param {string} message - The message that will be sent in the conversation.
 * @example
 * const openAiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
 *    headers: {
 *        Authorization: `Bearer ${OPENAI_API_KEY}`,
 *        "OpenAI-Beta": "realtime=v1"
 *    }
 * });
 * sendMessage(openAiWs, "Hello there");
 */
function sendMessage(openAiWs, message) {
    const initialConversationItem = {
        type: 'conversation.item.create',
        item: {
            type: 'message',
            role: 'user',
            content: [
                {
                    type: 'input_text',
                    text: message
                }
            ]
        }
    };

    const responseCreate = {
        type: 'response.create'
    }

    openAiWs.send(JSON.stringify(initialConversationItem));
    openAiWs.send(JSON.stringify(responseCreate));
    
}

/**
 * Sends an audio buffer to the OpenAI Realtime API to simulate a user sending audio in the conversation.
 * @function sendAudio
 * @memberOf module:api/controllers/openai
 * @param {WebSocket} openAiWs - The WebSocket connection to the OpenAI Realtime API.
 * @param {object} data - The audio data to send to the OpenAI Realtime API.
 * @param {object} data.media - The media object that contains the audio payload.
 * @param {string} data.media.payload - The audio payload to send to the OpenAI Realtime API.
 * @example
 * const openAiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
 *    headers: {
 *        Authorization: `Bearer ${OPENAI_API_KEY}`,
 *        "OpenAI-Beta": "realtime=v1"
 *    }
 * });
 * sendAudio(openAiWs, {
 *    media: {
 *        payload: 'data:audio/mpeg;base64,iVBORw0KGg...'
 *    }
 * });
 */
function sendAudio(openAiWs, data) {
    if (openAiWs.readyState === WebSocket.OPEN) {
        const audioAppend = {
            type: 'input_audio_buffer.append',
            audio: data.media.payload
        };
        openAiWs.send(JSON.stringify(audioAppend));
    }
}