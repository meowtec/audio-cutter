import React, { PureComponent } from 'react'
import getPeaks from './peaks'

const containerWidth = 1200
const containerHeight = 160

const dpr = window.devicePixelRatio || 1

export default class Waver extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      peaks: null
    }
  }

  componentWillMount() {
    this.setPeaks(this.props.channelData)
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    this.ctx = ctx
    this.repaint()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.channelData !== nextProps.channelData) {
      this.setPeaks(nextProps.channelData)
    }
  }

  componentDidUpdate() {
    this.repaint()
  }

  setPeaks(channelData) {
    console.time('peaks')
    const peaks = getPeaks(containerWidth * dpr, channelData)
    console.timeEnd('peaks')

    this.setState({
      peaks
    })
  }

  repaint() {
    const { ctx } = this
    const peaks = this.state.peaks
    const count = peaks.length

    ctx.clearRect(0, 0, containerWidth * dpr, containerHeight * dpr)

    for (var i = 0; i < count; i+=2) {
      const [min, max] = peaks[i]
      ctx.beginPath()
      ctx.lineWidth = '1'
      ctx.strokeStyle = this.props.strokeStyle
      ctx.moveTo(i - 0.5, (min + 1) * containerHeight + 0.5)
      ctx.lineTo(i - 0.5, (max + 1) * containerHeight - 0.5)
      ctx.stroke()
    }
  }

  render() {
    return (
      <canvas
        ref="canvas"
        className="wave-canvas"
        width={ containerWidth * dpr }
        height={ containerHeight * dpr }
      ></canvas>
    )
  }

}

Waver.defaultProps = {
  strokeStyle: '#c9f',
  channelData: null
}
