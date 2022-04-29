import React from 'react';
import ReactDOM from 'react-dom';
import Player from './player';
import FilePicker from './file';
import Icon from './icon';
import {
  isAudio, readBlobURL, download, rename,
} from './utils';
import { decodeAudioBuffer, sliceAudioBuffer } from './audio-helper';
import encode from './worker-client';
import './index.less';
import {
  downloadIcon,
  musicIcon,
  pauseIcon,
  playIcon,
  replayIcon,
  spinIcon,
} from './icons';
import { useClassicState } from './hooks';
import { SUpportedFormat } from './types';

function App() {
  const [state, setState] = useClassicState<{
    file: File | null;
    decoding: boolean;
    audioBuffer: AudioBuffer | null;
    paused: boolean;
    startTime: number;
    endTime: number;
    currentTime: number;
    processing: boolean;
  }>({
    file: null,
    decoding: false,
    audioBuffer: null,
    paused: true,
    startTime: 0,
    endTime: Infinity,
    currentTime: 0,
    processing: false,
  });

  const handleFileChange = async (file: File) => {
    if (!isAudio(file)) {
      alert('请选择合法的音频文件');
      return;
    }

    setState({
      file,
      paused: true,
      decoding: true,
      audioBuffer: null,
    });

    const audioBuffer = await decodeAudioBuffer(file);

    setState({
      paused: false,
      decoding: false,
      audioBuffer,
      startTime: 0,
      currentTime: 0,
      endTime: audioBuffer.duration / 2,
    });
  };

  const handleStartTimeChange = (time: number) => {
    setState({
      startTime: time,
    });
  };

  const handleEndTimeChange = (time: number) => {
    setState({
      endTime: time,
    });
  };

  const handleCurrentTimeChange = (time: number) => {
    setState({
      currentTime: time,
    });
  };

  const handleEnd = () => {
    setState({
      currentTime: state.startTime,
      paused: false,
    });
  };

  const handlePlayPauseClick = () => {
    setState({
      paused: !state.paused,
    });
  };

  const handleReplayClick = () => {
    setState({
      currentTime: state.startTime,
      paused: false,
    });
  };

  const handleEncode = (type: SUpportedFormat) => {
    const {
      startTime, endTime, audioBuffer, file,
    } = state;
    if (!audioBuffer || !file) return;

    const { length, duration } = audioBuffer;

    const audioSliced = sliceAudioBuffer(
      audioBuffer,
      Math.floor(length * startTime / duration),
      Math.floor(length * endTime / duration),
    );

    setState({
      processing: true,
    });

    encode(audioSliced, type)
      .then(readBlobURL)
      .then((url) => {
        download(url, rename(file.name, type));
      })
      .catch((e) => console.error(e))
      .then(() => {
        setState({
          processing: false,
        });
      });
  };

  const displaySeconds = (seconds: number) => `${seconds.toFixed(2)}s`;

  return (
    <div className="container">
      {
        state.audioBuffer || state.decoding ? (
          <div>
            <h2 className="app-title">Audio Cutter</h2>

            {
              state.decoding ? (
                <div className="player player-landing">
                  DECODING...
                </div>
              ) : (
                <Player
                  audioBuffer={state.audioBuffer!}
                  blob={state.file!}
                  paused={state.paused}
                  startTime={state.startTime}
                  endTime={state.endTime}
                  currentTime={state.currentTime}
                  onStartTimeChange={handleStartTimeChange}
                  onEndTimeChange={handleEndTimeChange}
                  onCurrentTimeChange={handleCurrentTimeChange}
                  onEnd={handleEnd}
                />
              )
            }

            <div className="controllers">
              <FilePicker className="ctrl-item" onPick={handleFileChange}>
                <Icon icon={musicIcon} />
              </FilePicker>

              <button
                type="button"
                className="ctrl-item"
                title="Play/Pause"
                onClick={handlePlayPauseClick}
              >
                <Icon icon={state.paused ? playIcon : pauseIcon} />
              </button>

              <button
                type="button"
                className="ctrl-item"
                title="Replay"
                onClick={handleReplayClick}
              >
                <Icon icon={replayIcon} />
              </button>

              <div className="dropdown list-wrap">
                <button
                  type="button"
                  className="ctrl-item"
                >
                  <Icon icon={state.processing ? spinIcon : downloadIcon} />
                </button>
                {
                  !state.processing && (
                    <ul className="list">
                      <li>
                        <button
                          type="button"
                          onClick={() => handleEncode('wav')}
                        >
                          Wav
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleEncode('mp3')}
                          data-type="mp3"
                        >
                          MP3
                        </button>
                      </li>
                    </ul>
                  )
                }
              </div>

              {
                Number.isFinite(state.endTime)
                && (
                <span className="seconds">
                  Select
                  {' '}
                  <span className="seconds-range">
                    {
                    displaySeconds(state.endTime - state.startTime)
                  }
                  </span>
                  {' '}
                  of
                  {' '}
                  <span className="seconds-total">
                    {
                    displaySeconds(state.audioBuffer!.duration)
                  }
                  </span>
                  {' '}
                  (from
                  {' '}
                  <span className="seconds-start">
                    {
                    displaySeconds(state.startTime)
                  }
                  </span>
                  {' '}
                  to
                  {' '}
                  <span className="seconds-end">
                    {
                    displaySeconds(state.endTime)
                  }
                  </span>
                  )
                </span>
                )
              }
            </div>
          </div>
        ) : (
          <div className="landing">
            <h2>Audio Cutter</h2>
            <FilePicker onPick={handleFileChange}>
              <div className="file-main">
                <Icon icon={musicIcon} />
                Select music file
              </div>
            </FilePicker>
          </div>
        )
      }
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('main'));
