/**
 * 找出数组某区域最大最小值
 * @param {Array<number>} array
 * @param {number} start
 * @param {number} end
 */
function getMinMaxInRange (array, start, end) {
  let min = 0
  let min1 = 0
  let max = 0
  let max1 = 0
  let current
  let step = parseInt((end - start) / 15)

  for (var i = start; i < end; i = i + step) {
    current = array[i]
    if (current < min) {
      min1 = min
      min = current
    } else if (current > max) {
      max1 = max
      max = current
    }
  }

  return [(min + min1) / 2, (max + max1) / 2]
}

/**
 * 峰值取样
 * @param {number} width
 * @param {Float32Array} data
 * @return {Array<[number, number]>}
 */
export default function (width, data) {
  const dataLength = data.length
  const size = dataLength / width
  let current = 0
  let peaks = new Array(width)
  for (var i = 0; i < width; i++) {
    let start = ~~current
    current = current + size
    let end = ~~current
    peaks[i] = getMinMaxInRange(data, start, end)
  }

  return peaks
}
