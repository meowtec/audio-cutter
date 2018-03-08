import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Waver from './waver'
import Dragger from './dragger'
import WebAudio from './webaudio'
import { formatSeconds, leftZero } from './utils'
import Color from 'color'

const containerWidth = 1000
const containerHeight = 160

function getClipRect (start, end) {
  return `rect(0, ${end}px, ${containerHeight}px, ${start}px)`
}

const color1 = '#0cf'
const color2 = Color(color1).lighten(0.1).toString()
const gray1 = '#ddd'
const gray2 = '#e3e3e3'

export default class Player extends PureComponent {
  /**
   * 存储当前播放位置，
   * DidUpdate 时和 props 传入的 currentTime 对比
   */
  currentTime = 0

  /**
   * @type {AudioBuffer}
   */
  audioBuffer = null

  get widthDurationRatio () {
    return containerWidth / this.props.audioBuffer.duration
  }

  clean () {
    const { audio } = this

    audio && audio.destroy()
  }

  initWebAudio () {
    this.clean()

    const { audioBuffer } = this.props

    const audio = new WebAudio(audioBuffer)

    audio.on('process', this.onAudioProcess)
    audio.on('end', this.onAudioProcessEnd)

    if (!this.props.paused) {
      audio.play(this.props.currentTime)
    }

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

  onAudioProcess = current => {
    if (this.props.currentTime < this.props.endTime &&
      current >= this.props.endTime
    ) {
      this.props.onCurrentTimeChange(this.props.startTime || 0)
    } else {
      this.currentTime = current
      this.props.onCurrentTimeChange(current)
    }
  }

  onAudioProcessEnd = () => {
    this.props.onCurrentTimeChange(this.props.startTime || 0)
  }

  dragEnd = pos => {
    this.props.onEndTimeChange(this.pos2Time(this.keepInRange(pos.x)))
  }

  dragCurrent = pos => {
    this.props.onCurrentTimeChange(this.pos2Time(this.keepInRange(pos.x)))
  }

  dragStart = pos => {
    this.props.onStartTimeChange(this.pos2Time(this.keepInRange(pos.x)))
  }

  pos2Time (pos) {
    return pos / this.widthDurationRatio
  }

  time2pos (time) {
    return time * this.widthDurationRatio
  }

  componentDidUpdate (prevProps, prevState) {
    // 如果 paused 状态改变
    if (prevProps.paused !== this.props.paused) {
      if (this.props.paused) {
        this.audio.pause()
      } else {
        this.audio.play(this.props.currentTime)
      }
    }

    // 如果 currentTime 改变（传入的和上次 onChange 的不同），从改变处播放
    if (!this.props.paused &&
      this.currentTime !== this.props.currentTime) {
      this.audio.play(this.props.currentTime)
    }

    if (this.props.audioBuffer !== prevProps.audioBuffer) {
      this.initWebAudio()
    }
  }

  componentDidMount () {
    this.initWebAudio()
  }

  renderTimestamp () {
    const formated = formatSeconds(this.props.currentTime)

    return (
      <div className='cursor-current'>
        <span className='num'>{formated[0]}</span>'
        <span className='num'>{formated[1]}</span>.
        <span className='num'>{leftZero(formated[2], 2)}</span>
      </div>
    )
  }

  render () {
    const start = this.time2pos(this.props.startTime)
    const end = this.time2pos(this.props.endTime)
    const current = this.time2pos(this.props.currentTime)

    return (
      <div className='player'>
        <div className='clipper'>
          <Waver
            audioBuffer={this.props.audioBuffer}
            width={containerWidth}
            height={containerHeight}
            color1={gray1}
            color2={gray2}
          />
        </div>
        <div
          className='clipper'
          style={{ clip: getClipRect(start, end) }}
        >
          <Waver
            audioBuffer={this.props.audioBuffer}
            width={containerWidth}
            height={containerHeight}
            color1={color1}
            color2={color2}
          />
        </div>
        <Dragger
          x={start}
          onDrag={this.dragStart}
        />
        <Dragger
          className='drag-current'
          x={current}
          onDrag={this.dragCurrent}
        >
          {this.renderTimestamp()}
        </Dragger>
        <Dragger
          x={end}
          onDrag={this.dragEnd}
        />
      </div>
    )
  }

  static propTypes = {
    encoding: PropTypes.bool,
    audioBuffer: PropTypes.instanceOf(AudioBuffer),
    paused: PropTypes.bool,
    startTime: PropTypes.number,
    endTime: PropTypes.number,
    currentTime: PropTypes.number,

    onStartTimeChange: PropTypes.func,
    onEndTimeChange: PropTypes.func,
    onCurrentTimeChange: PropTypes.func,
  }
}
