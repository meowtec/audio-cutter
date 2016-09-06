import React, { PureComponent } from 'react'
import Waver from './waver'
import Dragger from './dragger'
import WebAudio from './webaudio'
import { autobind } from './utils'

const containerWidth = 1000
const containerHeight = 160

function getClipRect(start, end) {
  return `rect(0, ${end}px, ${containerHeight}px, ${start}px)`
}

export default class Player extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      start: 0,
      end: 0,
      current: 0,
      channelData: null,
    }

    this.reinit()
  }

  get widthDurationRatio() {
    return containerWidth / this.audio.duration
  }

  clean() {
    const { audio } = this
    if (!audio) {
      return
    }

    audio.destroy()
  }

  reinit() {
    this.clean()

    const audio = new WebAudio(this.props.file)
    audio.repeat = true
    audio.init().then(this.audioReady)
    audio.on('process', this.audioProcess)

    this.audio = audio
  }

  keepInRange(x) {
    if (x < 0) {
      return 0
    }

    if (x > containerWidth) {
      return containerWidth
    }

    return x
  }

  @autobind
  audioReady() {
    const audio = this.audio
    this.setState({
      channelData: audio.channelData,
      start: 0,
      end: this.widthDurationRatio * audio.duration / 2
    }, () => {
      this.play()
    })
  }

  @autobind
  audioProcess(current) {
    this.setState({
      current: this.widthDurationRatio * current
    })
  }

  @autobind
  dragEnd(pos) {
    this.setState({
      end: this.keepInRange(pos.x)
    })
  }

  @autobind
  dragCurrent(pos) {
    const fixedX = this.keepInRange(pos.x)
    this.setState({
      current: fixedX
    })

    this.audio.position = fixedX / this.widthDurationRatio
  }

  @autobind
  dragStart(pos) {
    this.setState({
      start: this.keepInRange(pos.x)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    this.audio.startPosition = this.state.start / this.widthDurationRatio
    this.audio.endPosition = this.state.end / this.widthDurationRatio

    if (this.props.file !== prevProps.file) {
      this.reinit()
    }
  }

  play(...args) {
    this.audio.play(...args)
    this.props.onPlay()
  }

  pause() {
    this.audio.pause()
    this.props.onPause()
  }

  render() {
    const {
      start, current, end, channelData
    } = this.state

    if (!channelData) {
      return (
        <div className="player player-landing">
          DECODING...
        </div>
      )
    }

    return (
      <div className="player">
        <div className="clipper">
          <Waver channelData={channelData} width={containerWidth} height={containerHeight}/>
        </div>
        <div className="clipper" style={{ clip: getClipRect(start, end) }}>
          <Waver channelData={channelData} width={containerWidth} height={containerHeight} color="#0cf"/>
        </div>
        <Dragger x={start} onDrag={this.dragStart}/>
        <Dragger className="drag-current" x={current} onDrag={this.dragCurrent}/>
        <Dragger x={end} onDrag={this.dragEnd}/>
      </div>
    )
  }
}

Player.defauldProps = {
  file: null
}
