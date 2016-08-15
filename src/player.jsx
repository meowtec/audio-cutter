import React, { PureComponent } from 'react'
import Waver from './waver'
import Dragger from './dragger'
import WebAudio from './webaudio'
import { autobind } from './utils'

const containerWidth = 1200

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

  /**
   * seconds to pixel
   */
  s2p(s) {
    return containerWidth / this.audio.duration * s
  }

  /**
   * pixel to seconds
   */
  p2s(p) {
    return this.audio.duration / containerWidth * p
  }

  /**
   * TODO: on file update
   */
  reinit() {
    const audio = new WebAudio(this.props.file)

    audio.repeat = true

    audio.init().then(this.audioReady.bind(this))
    audio.on('process', this.audioProcess.bind(this))

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

  audioReady() {
    const audio = this.audio
    this.setState({
      channelData: audio.channelData,
      end: this.s2p(audio.duration) / 2
    }, () => {
      audio.play()
    })
  }

  audioProcess(current) {
    this.setState({
      current: this.s2p(current)
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
    this.setState({
      current: this.keepInRange(pos.x)
    })

    this.audio.play(this.p2s(pos.x))
  }

  @autobind
  dragStart(pos) {
    this.setState({
      start: this.keepInRange(pos.x)
    })
  }

  componentDidUpdate(_, prevState) {
    this.audio.startPosition = this.p2s(this.state.start)
    this.audio.endPosition = this.p2s(this.state.end)
  }

  render() {
    const {
      start, current, end, channelData
    } = this.state

    if (!channelData) {
      return (
        <div className="player">
          DECODING
        </div>
      )
    }

    return (
      <div className="player">
        <div className="selection" style={{ left: start + 'px', width: end - start + 'px'}}></div>
        <Waver channelData={channelData}/>
        <Dragger x={start} onDrag={this.dragStart}/>
        <Dragger x={current} onDrag={this.dragCurrent}/>
        <Dragger x={end} onDrag={this.dragEnd}/>
      </div>
    )
  }
}

Player.defauldProps = {
  file: null
}
