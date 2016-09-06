import React, { PureComponent } from 'react'
import getPeaks from './peaks'
import Color from 'color'

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
    const peaks = getPeaks(this.props.width * dpr, channelData)
    console.timeEnd('peaks')

    this.setState({
      peaks
    })
  }

  repaint() {
    const { ctx } = this
    const peaks = this.state.peaks
    const count = peaks.length
    const height = this.props.height
    const centerY = this.props.height / 2 * dpr
    const color = this.props.color
    const lightColor = Color(color).lighten(0.2).hexString()

    ctx.lineWidth = 1
    ctx.clearRect(0, 0, this.props.width * dpr, this.props.height * dpr)

    for (var i = 0; i < count; i++) {
      const [min, max] = peaks[i]
      const x = i - 0.5

      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.moveTo(x, ((min + 1) * height) + 0.5)
      ctx.lineTo(x, centerY)
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = lightColor
      ctx.moveTo(x, centerY)
      ctx.lineTo(x, ((max + 1) * height) + 0.5)
      ctx.stroke()
    }
  }

  render() {
    return (
      <canvas
        ref="canvas"
        className="wave-canvas"
        style={{
          width: this.props.width + 'px',
          height: this.props.height + 'px'
        }}
        width={ this.props.width * dpr }
        height={ this.props.height * dpr }
      ></canvas>
    )
  }

}

Waver.defaultProps = {
  color: '#aaa',
  channelData: null
}
