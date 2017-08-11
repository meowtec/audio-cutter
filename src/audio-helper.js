import { range } from './utils'

/**
 * decode arrayBuffer of audio file to AudioBuffer
 * @param {ArrayBuffer} arrayBuffer
 * @return {Promise<AudioBuffer>}
 * @deprecated use AudioContext.decodeAudioData directly
 */
export function decodeAudioArrayBuffer (arrayBuffer) {
  return new AudioContext().decodeAudioData(arrayBuffer)
}

/**
 * slice AudioBuffer from start byte to end byte
 * @param {AudioBuffer} audioBuffer
 * @return {AudioBuffer}
 */
export function sliceAudioBuffer (audioBuffer, start = 0, end = audioBuffer.length) {
  const newBuffer = new AudioContext().createBuffer(
    audioBuffer.numberOfChannels,
    end - start,
    audioBuffer.sampleRate
  )

  for (var i = 0; i < audioBuffer.numberOfChannels; i++) {
    newBuffer.copyToChannel(audioBuffer.getChannelData(i).slice(start, end), i)
  }

  return newBuffer
}

/**
 * serialize AudioBuffer for message send
 * @param {AudioBuffer} audioBuffer
 */
export function serializeAudioBuffer (audioBuffer) {
  return {
    channels: range(0, audioBuffer.numberOfChannels - 1)
      .map(i => audioBuffer.getChannelData(i)),
    sampleRate: audioBuffer.sampleRate,
    length: audioBuffer.length,
  }
}
