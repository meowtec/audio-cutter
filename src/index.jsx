import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Player from './player'
import FilePicker from './file'
import Icon from './icon'
import { isAudio, className } from './utils'
import './index.less'

class Main extends Component {
  constructor() {
    super()
    this.state = {
      file: null,
    }
  }

  handleFileChange(file) {
    if (!isAudio(file)) {
      return alert('请选择合法的音频文件')
    }

    this.setState({
      file
    })
  }

  render() {
    return (
      <div className="container">
        {
          this.state.file ? (
            <div className="">
              <h2>Audio Cutter</h2>
              <Player file={this.state.file}/>
              <div className="controllers">
                <FilePicker onChange={this.handleFileChange.bind(this)}>
                  <Icon name="music"/>
                  选择音乐文件
                </FilePicker>
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
