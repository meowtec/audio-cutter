import { Encoder } from '../types';

Object.assign(globalThis, {
  Mp3LameEncoderConfig: {
    memoryInitializerPrefixURL: '/audio-cutter/vendor/',
    TOTAL_MEMORY: 1073741824,
  },
});

importScripts('/audio-cutter/vendor/Mp3LameEncoder.min.js');

const encodeAudioBufferLame: Encoder = ({
  channels,
  sampleRate,
}) => {
  // new an encoder: bitRate = 192
  const encoder = new (globalThis as any).Mp3LameEncoder(sampleRate, 192);
  encoder.encode(channels);

  const blob = encoder.finish();
  return blob;
};

export default encodeAudioBufferLame;
