export interface SerializedAudioBuffer {
  channels: Float32Array[];
  sampleRate: number;
  length: number;
}

export type Encoder = (data: SerializedAudioBuffer) => Blob;

export type SUpportedFormat = 'wav' | 'mp3';

export interface EncoderWorkerReq {
  type: SUpportedFormat;
  id: number;
  audioData: SerializedAudioBuffer;
}

export type EncoderWorkerRes = {
  id: number;
  success: false;
  message: string;
} | {
  id: number;
  success: true;
  data: Blob;
};
