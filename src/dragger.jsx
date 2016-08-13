import React, { PureComponent } from 'react'
import { autobind } from './utils'

export default class Dragger extends PureComponent {
  @autobind
  handleMouseDown(e) {
    this._screenX = e.screenX
    this._screenY = e.screenY

    window.addEventListener('mousemove', this.handleMouseMove, false)
    window.addEventListener('mouseup', this.handleMouseUp, false)
  }

  @autobind
  handleMouseMove(e) {
    const prevX = this._screenX
    const prevY = this._screenY
    this._screenX = e.screenX
    this._screenY = e.screenY
    this.props.onDrag({
      x: this.props.x + this._screenX - prevX,
      y: this.props.y + this._screenY - prevY,
    })
  }

  @autobind
  handleMouseUp() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    return (
      <div className="dragger"
        onMouseDown={this.handleMouseDown.bind(this)}
        style={{
          left: this.props.x + 'px',
          top: this.props.y + 'px',
      }}>

      </div>
    )
  }
}

Dragger.defaultProps = {
  onDrag() {},
  x: 0,
  y: 0,
}