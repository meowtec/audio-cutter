export const audioContext = new AudioContext()

/**
* @param {ArrayBuffer} arrayBuffer
* @return {Promise<AudioBuffer>}
*/
export function decodeAudioArrayBuffer(arrayBuffer) {
  return audioContext.decodeAudioData(arrayBuffer)
}

/**
* @param {AudioBuffer} audioBuffer
* @return {AudioBuffer}
*/
export function sliceAudioBuffer(audioBuffer, start = 0, end = audioBuffer.length) {
  if (end == null) {
    end = audioBuffer.length
  }
  const newBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, end - start , audioBuffer.sampleRate)
  for (var i = 0; i < audioBuffer.numberOfChannels; i++) {
    newBuffer.copyToChannel(audioBuffer.getChannelData(i).slice(start, end), i)
  }
  return newBuffer
}
