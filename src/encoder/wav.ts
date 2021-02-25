/* eslint-disable no-param-reassign, no-plusplus */
/**
 * inspired by Recordmp3.js
 * https://github.com/nusofthq/Recordmp3js/blob/master/js/recorderWorker.js
 */

import { Encoder } from '../types';

function interleave(inputs: Float32Array[]) {
  if (inputs.length === 1) {
    return inputs[0];
  }
  const inputL = inputs[0];
  const inputR = inputs[1];
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);

  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = input[i];

    if (s < 0) {
      if (s < -1) s = -1;
      s *= 0x8000;
    } else {
      if (s > 1) s = 1;
      s *= 0x7FFF;
    }

    view.setInt16(offset, s, true);
  }
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(samples: Float32Array, numChannels: number, sampleRate: number) {
  const buffer = new ArrayBuffer(44 + (samples.length * 2));
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 32 + (samples.length * 2), true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * (numChannels * 2), true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return view;
}

const encodeAudioBufferWav: Encoder = ({
  channels,
  sampleRate,
}) => {
  const interleaved = interleave(channels);
  const dataview = encodeWAV(interleaved, channels.length, sampleRate);

  return new Blob([dataview], { type: 'audio/wav' });
};

export default encodeAudioBufferWav;
