import clsx from 'clsx';
import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import getPeaks from './peaks';

const dpr = window.devicePixelRatio || 1;

interface AudioWaveProps {
  className?: string;
  audioBuffer: AudioBuffer;
  width: number;
  height: number;
  color1?: string;
  color2?: string;
}

function AudioWave({
  width,
  height,
  color1 = '#ccc',
  color2 = '#ddd',
  audioBuffer,
  className,
}: AudioWaveProps) {
  const deviceWidth = width * dpr;

  const peaks = useMemo(
    () => getPeaks(Math.floor(deviceWidth), audioBuffer.getChannelData(0)),
    [audioBuffer, deviceWidth],
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paint = () => {
    const ctx = canvasRef.current?.getContext('2d');
    const count = peaks[0].length;
    const centerY = (height / 2) * dpr;
    if (!ctx) return;

    ctx.lineWidth = 1;
    ctx.clearRect(0, 0, deviceWidth, height * dpr);

    for (let i = 0; i < count; i += 1) {
      const min = peaks[0][i];
      const max = peaks[1][i];
      const x = i - 0.5;

      ctx.beginPath();
      ctx.strokeStyle = color1;
      ctx.moveTo(x, centerY + (centerY * min) + 0.5);
      ctx.lineTo(x, centerY);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = color2;
      ctx.moveTo(x, centerY);
      ctx.lineTo(x, centerY + (centerY * max) + 0.5);
      ctx.stroke();
    }
  };

  useEffect(() => {
    paint();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={clsx('wave-canvas', className)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      width={width * dpr}
      height={height * dpr}
    />
  );
}

export default memo(AudioWave);
