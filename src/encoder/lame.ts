import { Encoder } from '../types';

const vendorPrefix = process.env.IS_DEV
  ? '/vendor/'
  : '/audio-cutter/vendor/';

Object.assign(globalThis, {
  Mp3LameEncoderConfig: {
    memoryInitializerPrefixURL: vendorPrefix,
    TOTAL_MEMORY: 1073741824,
  },
});

importScripts(`${vendorPrefix}Mp3LameEncoder.min.js`);

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
