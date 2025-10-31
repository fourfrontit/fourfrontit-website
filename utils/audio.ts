
// Encodes raw audio bytes into a Base64 string.
export function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Decodes a Base64 string into raw audio bytes.
export function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Decodes raw PCM audio data into an AudioBuffer for playback.
// This is necessary because the browser's native decodeAudioData expects a file header.
export async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    // The raw data is 16-bit PCM, so we create an Int16Array view on the buffer.
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    
    // Create an empty AudioBuffer with the correct parameters.
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    // Fill the buffer with the audio data, converting from 16-bit integer to 32-bit float.
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // The PCM data is signed 16-bit, so its range is [-32768, 32767].
            // We normalize it to the float range [-1.0, 1.0].
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}
