import { serializeAudioBuffer } from './audio-helper';
import { EncoderWorkerRes } from './types';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/order
import Worker from 'worker-loader!./worker';

const worker = new Worker();

/**
 * use worker to encode audio
 */
export default function encode(audioBuffer: AudioBuffer, type: string): Promise<Blob> {
  const id = Math.random();

  return new Promise((resolve, reject) => {
    const audioData = serializeAudioBuffer(audioBuffer);
    worker.postMessage({
      type,
      audioData,
      id,
    });

    /**
     * Worker message event listener
     */
    const listener = ({ data }: MessageEvent<EncoderWorkerRes>) => {
      if (!data || data.id !== id) return;

      if (data.success) {
        resolve(data.data);
      } else {
        reject(new Error(data.message));
      }

      worker.removeEventListener('message', listener);
    };

    worker.addEventListener('message', listener);
  });
}
