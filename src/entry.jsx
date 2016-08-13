import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Player from './player'
import FilePicker from './file'
import { isAudio } from './utils'
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
        { this.state.file ? (
          <Player file={this.state.file}/>
        ) : null }
        <FilePicker onChange={this.handleFileChange.bind(this)}>上传音频文件</FilePicker>
      </div>
    )
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'))
