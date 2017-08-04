import encodeWav from './encoder/wav'
import encodeLame from './encoder/lame'

const encodeMap = {
  wav: encodeWav,
  mp3: encodeLame,
}

self.onmessage = function (e) {
  const { type, id, audioData } = e.data
  let blob

  try {
    const encode = encodeMap[type]
    if (!encode) throw new Error('Unkown audio encoding')

    blob = encode(audioData)
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
