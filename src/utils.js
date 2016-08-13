/**
 * detect if a file is an audio.
 * @param {File} file
 */
export function isAudio(file) {
  return file.type.indexOf('audio') > -1
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
 * Read File/Blob to ArrayBuffer
 * @param {File} file
 * @return {Promise<ArrayBuffer>}
 */
export function readArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => resolve(reader.result)
  })
}

/**
 * decorators
 * bind class instance as `this` to method automatically.
 * @example
 * class Component {
 *   @autobind
 *   handleButtonClick() {}
 * }
 */
export function autobind(target, key, descriptor) {
  return {
    get() {
      const fun = descriptor.value.bind(this)
      Object.defineProperty(this, key, {
        value: fun
      })
      return fun
    }
  }
}

function objectToClassName(obj) {
  return Object.keys(obj).reduce((prev, key) => {
    return obj[key] ? (prev + ' ' + key) : prev
  }, '')
}

/**
 * className for human
 * @example
 * className('button', 'primary', { disabled: true })
 */
export function className(...args) {
  return args.reduce((prev, value) => {
    if (typeof value === 'string') {
      return prev + ' ' + value
    } else {
      return prev + ' ' + objectToClassName(value)
    }
  }, '')
}
