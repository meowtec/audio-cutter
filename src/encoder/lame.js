/* global Mp3LameEncoder */

self.Mp3LameEncoderConfig = {
  memoryInitializerPrefixURL: '../vendor/',
  TOTAL_MEMORY: 1073741824,
}

self.importScripts('../vendor/Mp3LameEncoder.min.js')

export default function encodeAudioBufferLame ({
  channels,
  sampleRate,
}) {
  console.log(channels)
  // new an encoder: bitRate = 192
  const encoder = new Mp3LameEncoder(sampleRate, 192)
  encoder.encode(channels)

  const blob = encoder.finish()
  console.log(blob)
  return blob
}
