// Helper function to write a string at a given byte offset in the DataView
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

exports.binaryStringToArrayBuffer = (binaryString) => {
    // Step 1: Create a new ArrayBuffer with the same length as the binary string
    let buffer = new ArrayBuffer(binaryString.length);

    // Step 2: Create a Uint8Array view for the buffer
    let uint8Array = new Uint8Array(buffer);

    // Step 3: Fill the buffer with the binary string's character codes
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    return buffer;
}

exports.createWavHeader = (sampleRate, numChannels, bitsPerSample, dataSize) => {
    const blockAlign = numChannels * (bitsPerSample / 8);
    const byteRate = sampleRate * blockAlign;
    const buffer = new ArrayBuffer(44); // WAV header is always 44 bytes
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    writeString(view, 0, "RIFF");                // Chunk ID
    view.setUint32(4, 36 + dataSize, true);      // Chunk Size (36 + SubChunk2Size)
    writeString(view, 8, "WAVE");               // Format

    // fmt subchunk
    writeString(view, 12, "fmt ");              // Subchunk1 ID
    view.setUint32(16, 16, true);               // Subchunk1 Size (16 for PCM)
    view.setUint16(20, 1, true);                // Audio Format (1 for PCM)
    view.setUint16(22, numChannels, true);      // NumChannels
    view.setUint32(24, sampleRate, true);       // SampleRate
    view.setUint32(28, byteRate, true);         // ByteRate
    view.setUint16(32, blockAlign, true);       // BlockAlign
    view.setUint16(34, bitsPerSample, true);    // BitsPerSample

    // data subchunk
    writeString(view, 36, "data");              // Subchunk2 ID
    view.setUint32(40, dataSize, true);         // Subchunk2 Size

    return buffer;
}

exports.concat2ArrayBuffers = (buffer1, buffer2) => {
    // Create Uint8Array views for both buffers
    const view1 = new Uint8Array(buffer1);
    const view2 = new Uint8Array(buffer2);

    // Create a new ArrayBuffer with a size equal to both buffers combined
    const combinedBuffer = new ArrayBuffer(buffer1.byteLength + buffer2.byteLength);
    const combinedView = new Uint8Array(combinedBuffer);

    // Copy the contents of both buffers into the new buffer
    combinedView.set(view1, 0); // Copy the first buffer
    combinedView.set(view2, view1.byteLength); // Copy the second buffer after the first

    return combinedBuffer;
}

// Concatenate multiple ArrayBuffers
exports.concatArrayBuffers = (buffers) => {
    const totalSize = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combined = Buffer.alloc(totalSize);
    let offset = 0;

    for (const buf of buffers) {
        combined.set(new Uint8Array(buf), offset);
        offset += buf.byteLength;
    }

    return combined;
}

