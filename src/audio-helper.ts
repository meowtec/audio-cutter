import { range, readArrayBuffer } from './utils';

/**
 * slice AudioBuffer from start byte to end byte
 */
export function sliceAudioBuffer(audioBuffer: AudioBuffer, start = 0, end = audioBuffer.length) {
  const newBuffer = new AudioContext().createBuffer(
    audioBuffer.numberOfChannels,
    end - start,
    audioBuffer.sampleRate,
  );

  for (let i = 0; i < audioBuffer.numberOfChannels; i += 1) {
    newBuffer.copyToChannel(audioBuffer.getChannelData(i).slice(start, end), i);
  }

  return newBuffer;
}

/**
 * serialize AudioBuffer for message send
 */
export function serializeAudioBuffer(audioBuffer: AudioBuffer) {
  return {
    channels: range(0, audioBuffer.numberOfChannels - 1)
      .map((i) => audioBuffer.getChannelData(i)),
    sampleRate: audioBuffer.sampleRate,
    length: audioBuffer.length,
  };
}

export async function decodeAudioBuffer(blob: Blob) {
  const arrayBuffer = await readArrayBuffer(blob);
  const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);

  return audioBuffer;
}
