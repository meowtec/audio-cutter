/**
 * 找出数组某区域最大最小值
 */
function getMinMaxInRange(array: ArrayLike<number>, start: number, end: number) {
  let min = 0;
  let min1 = 0;
  let max = 0;
  let max1 = 0;
  let current;
  const step = Math.floor((end - start) / 15);

  for (let i = start; i < end; i += step) {
    current = array[i];
    if (current < min) {
      min1 = min;
      min = current;
    } else if (current > max) {
      max1 = max;
      max = current;
    }
  }

  return [(min + min1) / 2, (max + max1) / 2];
}

/**
 * 峰值取样
 */
export default function getPeaks(
  width: number,
  data: Float32Array,
): [min: Float32Array, max: Float32Array] {
  const dataLength = data.length;
  const size = dataLength / width;
  let current = 0;
  const min = new Float32Array(width);
  const max = new Float32Array(width);

  for (let i = 0; i < width; i += 1) {
    const start = Math.floor(current);
    current += size;
    const end = Math.floor(current);
    [min[i], max[i]] = getMinMaxInRange(data, start, end);
  }

  return [min, max];
}
