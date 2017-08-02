import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Player from './player'
import FilePicker from './file'
import Icon from './icon'
import { isAudio, readBlobURL, download } from './utils'
import { sliceAudioBuffer } from './audio-helper'
import encoder from './encoder'
import './index.less'

class Main extends Component {
  constructor () {
    super()

    this.state = {
      file: null,
      paused: true,
    }
  }

  handleFileChange = (file) => {
    if (!isAudio(file)) {
      return alert('请选择合法的音频文件')
    }

    this.setState({
      file,
      paused: false,
    })
  }

  handlePlayerPause = () => {
    this.setState({
      paused: true,
    })
  }

  handlePlayerPlay = () => {
    this.setState({
      paused: false,
    })
  }

  handlePlayPauseClick = (file) => {
    const player = this.refs.player
    this.state.paused ? player.play() : player.pause()
  }

  handleEncode (type) {
    const player = this.refs.player
    const audioSliced = sliceAudioBuffer(player.audioBuffer, player.startByte, player.endByte)
    encoder
      .wav(audioSliced)
      .then(readBlobURL)
      .then(url => {
        download(url, 'a.wav')
      })
  }

  render () {
    return (
      <div className='container'>
        {
          this.state.file ? (
            <div>
              <h2 className='app-title'>Audio Cutter</h2>
              <Player
                onPause={this.handlePlayerPause}
                onPlay={this.handlePlayerPlay}
                ref='player'
                file={this.state.file}
              />
              <div className='controllers'>
                <FilePicker onChange={this.handleFileChange}>
                  <div className='ctrl-item'>
                    <Icon name='music' />
                  </div>
                </FilePicker>
                <button className='ctrl-item' onClick={this.handlePlayPauseClick}>
                  <Icon name={this.state.paused ? 'play' : 'pause'} />
                </button>
                <div className='dropdown'>
                  <button className='ctrl-item list-wrap'>
                    <Icon name='download' />
                    <ul className='list'>
                      <li><button onClick={() => this.handleEncode('wav')}>Wav</button></li>
                      <li><button>MP3</button></li>
                      <li><button>M4R</button></li>
                    </ul>
                    </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='landing'>
              <h2>Audio Cutter</h2>
              <FilePicker onChange={this.handleFileChange}>
                <div className='file-main'>
                  <Icon name='music' />
                  选择音乐文件
                </div>
              </FilePicker>
            </div>
          )
        }
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('main'))
