/**
 * detect if a file is an audio.
 * @param {File} file
 */
export const isAudio = file =>
  file.type.indexOf('audio') > -1

/**
 * create range [min .. max]
 */
export const range = (min, max) =>
  Array
    .apply(null, { length: max - min + 1 })
    .map((v, i) => i + min)

/**
 * FileReader via promise
 * @param {File} file
 * @param {string} dataType
 * @return {Promise<ArrayBuffer | string>}
 */
export const readFile = (file, dataType) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader['readAs' + dataType](file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = err => reject(err)
  })

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

export const download = (url, name) => {
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
}

export const rename = (filename, ext, stamp) =>
  `${filename.replace(/\.\w+$/, '')}${stamp || ''}.${ext}`

/**
 * format seconds to [minutes, integer, decimal(2)]
 * @param {number} seconds
 */
export const formatSeconds = seconds =>
  [
    Math.floor(seconds / 60),
    Math.floor(seconds % 60),
    Math.round(seconds % 1 * 100),
  ]

export const leftZero = (num, count) => {
  return ('000000' + num).slice(-count)
}
