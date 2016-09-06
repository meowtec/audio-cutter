import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Player from './player'
import FilePicker from './file'
import Icon from './icon'
import { isAudio, className, autobind } from './utils'
import './index.less'

class Main extends Component {
  constructor() {
    super()
    this.state = {
      file: null,
      paused: true,
    }
  }

  handleFileChange(file) {
    if (!isAudio(file)) {
      return alert('请选择合法的音频文件')
    }

    this.setState({
      file,
      paused: false,
    })
  }

  @autobind
  handlePlayerPause() {
    this.setState({
      paused: true
    })
  }

  @autobind
  handlePlayerPlay() {
    this.setState({
      paused: false
    })
  }

  @autobind
  handlePlayPauseClick(file) {
    const player = this.refs.player
    this.state.paused ? player.play() : player.pause()
  }

  render() {
    return (
      <div className="container">
        {
          this.state.file ? (
            <div>
              <h2 className="app-title">Audio Cutter</h2>
              <Player
                onPause={this.handlePlayerPause}
                onPlay={this.handlePlayerPlay}
                ref="player"
                file={this.state.file}
              />
              <div className="controllers">
                <button className="ctrl-item">
                  <Icon name="music"/>
                </button>
                <button className="ctrl-item" onClick={this.handlePlayPauseClick}>
                  <Icon name={ this.state.paused ? 'play' : 'pause' }/>
                </button>
                <div className="dropdown">
                  <button className="ctrl-item">
                    <Icon name="download"/>
                  </button>
                  <div className="list-wrap">
                    <ul className="list">
                      <li><button>Wav</button></li>
                      <li><button>MP3</button></li>
                      <li><button>M4R</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="landing">
              <h2>Audio Cutter</h2>
              <FilePicker onChange={this.handleFileChange.bind(this)}>
                <Icon name="music"/>
                选择音乐文件
              </FilePicker>
            </div>
          )
        }
      </div>
    )
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'))
