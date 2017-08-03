import encodeWav from './encoder/wav'

self.onmessage = function (e) {
  const { type, id, audioData } = e.data
  let blob

  try {
    if (type === 'wav') {
      blob = encodeWav(audioData)
    }
  } catch (err) {
    postMessage({
      id,
      error: true,
      message: err.toString(),
    })
  }

  postMessage({
    id,
    error: false,
    blob,
  })
}
