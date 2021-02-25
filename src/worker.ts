import encodeWav from './encoder/wav';
import encodeLame from './encoder/lame';
import { EncoderWorkerReq, EncoderWorkerRes } from './types';

const encodeMap = {
  wav: encodeWav,
  mp3: encodeLame,
};

globalThis.addEventListener('message', (e: MessageEvent<EncoderWorkerReq>) => {
  const { type, id, audioData } = e.data;
  let response: EncoderWorkerRes;

  try {
    const encode = encodeMap[type];
    if (!encode) throw new Error('Unkown audio encoding');
    response = {
      id,
      success: true,
      data: encode(audioData),
    };
  } catch (err) {
    response = {
      id,
      success: false,
      message: err.toString(),
    };
  }

  postMessage(response);
});
