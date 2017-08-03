import { serializeAudioBuffer } from './audio-helper'

const workerScript = document.querySelector('[x-audio-encode]')

if (!workerScript) {
  console.error('Missing worker script tag.')
}

export const worker = new Worker(workerScript && workerScript.src)

/**
 * use worker to encode audio
 * @param {AudioBuffer} audioBuffer
 * @param {string} type
 * @return {Promise<Blob>}
 */
export const encode = (audioBuffer, type) => {
  const id = Math.random()

  return new Promise((resolve, reject) => {
    const audioData = serializeAudioBuffer(audioBuffer)
    worker.postMessage({
      type,
      audioData,
      id,
    })

    /**
     * Worker message event listener
     * @param {MessageEvent} e
     */
    const listener = ({ data }) => {
      if (!data || data.id !== id) return

      if (data.error) {
        reject(new Error(data.message))
      } else {
        resolve(data.blob)
      }

      worker.removeEventListener('message', listener)
    }

    worker.addEventListener('message', listener)
  })
}
