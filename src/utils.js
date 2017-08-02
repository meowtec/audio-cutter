/**
 * detect if a file is an audio.
 * @param {File} file
 */
export function isAudio (file) {
  return file.type.indexOf('audio') > -1
}

export function range (min, max) {
  return Array
    .apply(null, { length: max - min + 1 })
    .map((v, i) => i + min)
}

// /**
//  * @param {string} url
//  * @returns {Promise<Blob>}
//  */
// export function fetch(url) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest()
//     xhr.open('GET', url, true)
//     xhr.responseType = 'blob'
//     xhr.send()
//     xhr.onload = () => {
//       resolve(xhr.response)
//     }
//     xhr.onerror = (err) => {
//       reject(new Error('XMLHttpRequest error.'))
//     }
//   })
// }

/**
 * FileReader via promise
 * @param {File} file
 * @param {string} dataType
 * @return {Promise<ArrayBuffer | string>}
 */
export function readFile (file, dataType) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader['readAs' + dataType](file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = err => reject(err)
  })
}

/**
 * Read File/Blob to ArrayBuffer
 * @param {File} file
 * @return {Promise<ArrayBuffer>}
 */
export const readArrayBuffer = file => readFile(file, 'ArrayBuffer')

/**
 * Read File/Blob to Base64
 * @param {File} file
 * @return {Promise<string>}
 */
export const readDataURL = file => readFile(file, 'DataURL')

export const readBlobURL = file => URL.createObjectURL(file)

export function download (url, name) {
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
}
