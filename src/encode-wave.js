/**
 * inspired by Recordmp3.js
 * https://github.com/nusofthq/Recordmp3js/blob/master/js/recorderWorker.js
 */

import { range } from './utils'

/**
* @param {AudioBuffer} audioBuffer
* @return {Promise<Blob>}
*/
export default function encodeAudioBuffer (audioBuffer) {
  return new Promise(resolve => {
    const channelNum = audioBuffer.numberOfChannels
    const channelDatas = range(0, channelNum - 1)
      .map(i => audioBuffer.getChannelData(i))

    // const interleaved = channelNum > 1 ? interleave(channelDatas[0], channelDatas[1]) : channelDatas[0]
    const interleaved = interleave(channelDatas)
    const dataview = encodeWAV(interleaved, channelNum, audioBuffer.sampleRate)
    const audioBlob = new Blob([dataview], { type: 'audio/wav' })

    resolve(audioBlob)
  })
}

/**
* @param {Float32Array} inputL
* @param {Float32Array} inputR
*/
function interleave (inputs) {
  if (inputs.length === 1) {
    return inputs[0]
  } else {
    const inputL = inputs[0]
    const inputR = inputs
    const length = inputL.length + inputR.length
    const result = new Float32Array(length)

    let index = 0
    let inputIndex = 0

    while (index < length) {
      result[index++] = inputL[inputIndex]
      result[index++] = inputR[inputIndex]
      inputIndex++
    }
    return result
  }
}

/**
 * @param {DataView} view
 * @param {number} offset
 * @param {Float32Array} input
 */
function floatTo16BitPCM (view, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
  }
}

/**
 * @param {DataView} view
 * @param {number} offset
 * @param {string} string
 */
function writeString (view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

/**
 * @param {Float32Array} samples
 * @param {number} numChannels
 */
function encodeWAV (samples, numChannels, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, 'RIFF')
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * 2, true)
  /* RIFF type */
  writeString(view, 8, 'WAVE')
  /* format chunk identifier */
  writeString(view, 12, 'fmt ')
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, 1, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 4, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true)
  /* bits per sample */
  view.setUint16(34, 16, true)
  /* data chunk identifier */
  writeString(view, 36, 'data')
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true)

  floatTo16BitPCM(view, 44, samples)

  return view
}
