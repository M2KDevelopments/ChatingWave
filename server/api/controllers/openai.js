const path = require('path');
const FS = require('fs');
const fs = require('fs').promises;
const WebSocket = require('ws');
const OpenAI = require('openai');
const OpenAITool = require('../models/assistants.tool');
const Assistant = require('../models/assistants');
const { binaryStringToArrayBuffer, concat2ArrayBuffers, concatArrayBuffers, createWavHeader } = require('../helpers/audio.buffer')
const OPENAI_MODEL = 'gpt-4o-realtime-preview-2024-10-01'
const User = require('../models/user');
const axios = require('axios');

// https://platform.openai.com/docs/guides/realtime#connect-with-webrtc
exports.chatDemo = async (req, res) => {
    const headers = {
        "Authorization": `Bearer ${process.env.OPENAI_API}`,
        "Content-Type": "application/json",
    };
    const data = {
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "verse",
        instructions:"You are a helpful AI that give motivatioal quotes. Your name is Larry."
    }
    const response = await axios.post("https://api.openai.com/v1/realtime/sessions", data, { headers });
    console.log(response.data)
    return res.render(path.join(__dirname, '../views', 'chat'), { data: response.data })
}
// Get Models
exports.getModels = async (req, res) => {
    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API });
        const models = await openai.models.list();
        return res.status(200).json(models.data);
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}


/** Assistants CRUD */
exports.getAssistants = async (req, res) => {
    try {
        const { uid } = req.user;
        return res.status(200).json(await Assistant.find({ user: uid }).lean());
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.getAssistant = async (req, res) => {
    try {
        const { id } = req.params;
        return res.status(200).json(await Assistant.findById(id).lean());
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.createAssistant = async (req, res) => {
    try {
        const { uid } = req.user;
        const { name } = req.body;

        // Check for existing assistant with the same name
        const existing = await Assistant.findOne({ name, user: uid })
        if (existing) return res.status(200).json({ result: true, message: `${name} already exists` });


        // Create Openai Assistant
        const openai = new OpenAI({ apiKey: req.body.api_key });
        const openAIAssistant = await openai.beta.assistants.create({
            name: name,
            description: req.body.description || "",
            instructions: req.body.prompt || "",
            tools: [],
            model: req.body.model || 'gpt-3.5-turbo',
            temperature: req.body.temperature || 0.8,
        });

        // Create Chating Wave Assistant
        const assistantId = openAIAssistant.id;
        req.body.assistant_id = assistantId;
        req.body.user = uid;
        const ast = new Assistant(req.body);
        const assistant = await ast.save();

        return res.status(201).json({ result: true, message: `${name} was created successfully`, id: assistant._id });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.updateAssistant = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;
        const {
            name, description, api_key, voice, model, temperature,
            files, vector_store_id, websites,
            prompt, elevenlabs_voice_id,
            webhook_url, webhook_headers, webhook_method,
        } = req.body;

        const ast = await Assistant.findOne({ _id: id, user: uid })
        if (!ast) return res.status(400).json({ result: false, message: `Assistant does not exist` });

        if (name != undefined) ast.name = name;
        if (description != undefined) ast.name = name;
        if (api_key != undefined) ast.name = name;
        if (voice != undefined) ast.name = name;
        if (model != undefined) ast.name = name;
        if (temperature != undefined) ast.name = name;
        if (files != undefined) ast.name = name;
        if (vector_store_id != undefined) ast.name = name;
        if (websites != undefined) ast.name = name;
        if (prompt != undefined) ast.name = name;
        if (elevenlabs_voice_id != undefined) ast.name = name;
        if (webhook_url != undefined) ast.name = name;
        if (webhook_headers != undefined) ast.name = name;
        if (webhook_method != undefined) ast.name = name;

        // Update assistant
        if (ast.api_key && ast.assistant_id) {
            const openai = new OpenAI({ apiKey: api_key || ast.api_key });
            await openai.beta.assistants.update(ast.assistant_id, {
                name: name,
                description: description,
                instructions: prompt,
                tools: [],
                model: model || ast.model,
                temperature: temperature || 0.8,
            });
        }


        await ast.save();
        return res.status(201).json({ result: true, message: `${ast.name} was updated successfully` });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.deleteAssistant = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const ast = await Assistant.findOne({ _id: id, user: uid })
        if (!ast) return res.status(400).json({ result: false, message: `Assistant does not exist` });

        try {
            // https://platform.openai.com/docs/api-reference/assistants/deleteAssistant
            const openai = new OpenAI({ apiKey: ast.api_key });
            await openai.beta.assistants.del(ast.assistant_id)
            console.log(`Remove Open AI Assistant`)
        } catch (err) {
        }

        await ast.remove();
        return res.status(201).json({ result: true, message: `${ast.name} was removed successfully` });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}



/* OpenAI Tools */
exports.getTools = async (req, res) => {
    try {
        return res.status(200).json(await OpenAITool.find({ user: req.user.uid }).lean());
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.getToolOne = async (req, res) => {
    try {
        return res.status(200).json(await OpenAITool.findById(req.params.id).lean());
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.postTool = async (req, res) => {
    try {
        const body = req.body;
        body.user = req.user.uid;
        const c = new OpenAITool(body);
        const tool = await c.save();
        return res.status(201).json({ result: true, message: `Tool saved successfully`, id: tool._id });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.patchTool = async (req, res) => {
    try {
        const { id } = req.params;
        const tool = await OpenAITool.findById(id).lean();
        if (!tool) return res.status(400).json({ result: false, message: 'Could not find tool' });

        if (req.body.name != undefined) tool.name = req.body.name;
        if (req.body.field != undefined) tool.field = req.body.field;
        if (req.body.description != undefined) tool.description = req.body.description;
        if (req.body.type != undefined) tool.type = req.body.type;

        await tool.save();

        return res.status(201).json({ result: true, message: `Updated Tool` });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.deleteTool = async (req, res) => {
    try {
        const { id } = req.params;
        await OpenAITool.findByIdAndDelete(id);
        const campaigns = await Assistant.find({ tools: { $in: [id] } }).select("tools");
        for (const c of campaigns) {
            c.tools = c.tools.filter(oid => oid != id);
            await c.save();
        }
        return res.status(201).json({ result: true, message: `Removed Tool` });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}


/* OpenAI Vector Store Files */
exports.getVectorFiles = async function (req, res) {
    try {
        const { id } = req.params;
        const ast = await Assistant.findById(id).lean();
        const openai = new OpenAI({ apiKey: ast.api_key });

        // Get Vector Store Files 
        const list = await openai.files.list();
        if (ast.vector_store_id) {
            const vectorStoreFiles = await openai.beta.vectorStores.files.list(ast.vector_store_id);

            // Map the vector files to the open ai file names
            const files = vectorStoreFiles.data.map(f => {
                const index = list.data.findIndex(file => file.id == f.id)
                if (index != -1) return { ...f, filename: list.data[index].filename };
                return f;
            });
            return res.status(200).json(files);
        }

        // Get All the files uploaded to openai
        return res.status(200).json([])
    } catch (e) {
        if (e.response) console.log(e.response.data)
        else console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

// https://platform.openai.com/docs/api-reference/files/create
exports.updateVectorFiles = async (req, res) => {

    try {
        const { uid } = req.user;
        const { id } = req.params;
        const ast = await Assistant.findOne({ _id: id, user: uid })
        if (!ast) return res.status(400).json({ result: false, message: `Assistant does not exist` });

        const openai = new OpenAI({ apiKey: ast.api_key });
        console.log('req.files', req.files);
        const aiFiles = [];
        for (const file of req.files) {
            // const { originalname, encoding, mimetype, path } = file;
            const f = await openai.files.create({
                file: FS.createReadStream(file.path),
                purpose: "assistants",
            });
            aiFiles.push(f);
        }



        // Create Vector Store
        // https://platform.openai.com/docs/api-reference/vector-stores-file-batches
        if (ast.vector_store_id) await openai.beta.vectorStores.del(ast.vector_store_id);
        const vectorStore = await openai.beta.vectorStores.create({ name: ast.name, file_ids: aiFiles.map(f => f.id) })

        // update actual openai assistant
        const tools = await this.getAssistantFunctionCallTools(id);
        const a = await openai.beta.assistants.update(ast.assistant_id, {
            tools: [...tools, { type: "file_search" }],
            tool_resources: {
                file_search: {
                    vector_store_ids: [vectorStore.id]
                }
            },
        });

        // save asssistant settings
        ast.files = aiFiles;
        ast.vector_store_id = vectorStore.id
        await ast.save();

        // remove all the files
        for (const file of req.files) {
            try {
                await fs.unlink(file.path)
            } catch (e) {
                // when something goes wrong
            }
        }
        return res.status(201).json({ result: true, message: `${req.files.length} File(s) was uploaded successfully` });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.deleteVectorFile = async (req, res) => {
    try {
        const { id, fileId } = req.params;
        const { uid } = req.user;

        const ast = await Assistant.findOne({ _id: id, user: uid });
        if (!ast) return res.status(400).json({ result: false, message: `Assistant does not exist` });

        // Remove file from openai
        const openai = new OpenAI({ apiKey: ast.api_key });

        // Remove file from vector store
        if (ast.vector_store_id && fileId) {
            console.log(uid, 'Removed file from vector store', ast.vector_store_id)
            await openai.beta.vectorStores.files.del(ast.vector_store_id, fileId);
        }

        const file = await openai.files.del(fileId);
        ast.files = ast.files.filter(f => f.id != fileId);

        await ast.save();
        return res.status(201).json({ result: true, message: `File was removed successfully`, file });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}


/** Openai Realtime API */
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