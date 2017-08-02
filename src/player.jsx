import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Waver from './waver'
import Dragger from './dragger'
import WebAudio from './webaudio'

const containerWidth = 1000
const containerHeight = 160

function getClipRect (start, end) {
  return `rect(0, ${end}px, ${containerHeight}px, ${start}px)`
}

export default class Player extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      start: 0,
      end: 0,
      current: 0,
      channelData: null,
    }

    this.reinit()
  }

  get widthDurationRatio () {
    return containerWidth / this.audio.duration
  }

  get audioBuffer () {
    return this.audio.audioBuffer
  }

  get startByte () {
    return parseInt(this.audioBuffer.length * this.state.start / this.widthDurationRatio / this.duration, 10)
  }

  get endByte () {
    return parseInt(this.audioBuffer.length * this.state.end / this.widthDurationRatio / this.duration, 10)
  }

  get duration () {
    return this.audio.duration
  }

  clean () {
    const { audio } = this
    if (!audio) {
      return
    }

    audio.destroy()
  }

  reinit () {
    this.clean()

    const audio = new WebAudio(this.props.file)
    audio.repeat = true
    audio.init().then(this.audioReady)
    audio.on('process', this.audioProcess)

    this.audio = audio
  }

  keepInRange (x) {
    if (x < 0) {
      return 0
    }

    if (x > containerWidth) {
      return containerWidth
    }

    return x
  }

  audioReady = () => {
    const audio = this.audio
    this.setState({
      channelData: audio.channelData,
      start: 0,
      end: this.widthDurationRatio * audio.duration / 2,
    }, () => {
      this.play()
    })
  }

  audioProcess = (current) => {
    this.setState({
      current: this.widthDurationRatio * current,
    })
  }

  dragEnd = (pos) => {
    this.setState({
      end: this.keepInRange(pos.x),
    })
  }

  dragCurrent = (pos) => {
    const fixedX = this.keepInRange(pos.x)
    this.setState({
      current: fixedX,
    })

    this.audio.position = fixedX / this.widthDurationRatio
  }

  dragStart = (pos) => {
    this.setState({
      start: this.keepInRange(pos.x),
    })
  }

  componentDidUpdate (prevProps, prevState) {
    this.audio.startPosition = this.state.start / this.widthDurationRatio
    this.audio.endPosition = this.state.end / this.widthDurationRatio

    if (this.props.file !== prevProps.file) {
      this.reinit()
    }
  }

  play (...args) {
    this.audio.play(...args)
    this.props.onPlay()
  }

  pause () {
    this.audio.pause()
    this.props.onPause()
  }

  render () {
    const {
      start, current, end, channelData,
    } = this.state

    if (!channelData) {
      return (
        <div className='player player-landing'>
          DECODING...
        </div>
      )
    }

    const currentSeconds = current / this.widthDurationRatio

    return (
      <div className='player'>
        <div className='clipper'>
          <Waver channelData={channelData} width={containerWidth} height={containerHeight} />
        </div>
        <div className='clipper' style={{ clip: getClipRect(start, end) }}>
          <Waver channelData={channelData} width={containerWidth} height={containerHeight} color='#0cf' />
        </div>
        <Dragger x={start} onDrag={this.dragStart} />
        <Dragger className='drag-current' x={current} onDrag={this.dragCurrent}>
          <div className='cursor-current'>{currentSeconds.toFixed(2)}</div>
        </Dragger>
        <Dragger x={end} onDrag={this.dragEnd} />
      </div>
    )
  }

  static propTypes = {
    file: PropTypes.instanceOf(Blob),
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
  }
}
