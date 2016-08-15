import React, { PureComponent } from 'react'
import getPeaks from './peaks'

const containerWidth = 1200
const containerHeight = 160

const dpr = window.devicePixelRatio || 1

export default class Waver extends PureComponent {

  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    this.ctx = ctx
    this.repaint()
  }

  /**
   * TODO: repaint
   */
  repaint() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, containerWidth * dpr, 100 * dpr)
    console.time('peaks')
    const peaks = getPeaks(containerWidth * dpr, this.props.channelData)
    console.timeEnd('peaks')
    const count = peaks.length
    for (var i = 0; i < count; i++) {
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
