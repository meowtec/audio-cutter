import React, { PureComponent } from 'react'
import { autobind, className } from './utils'

export default class Dragger extends PureComponent {
  @autobind
  handleMouseDown(e) {
    this._screenX = e.screenX
    this._screenY = e.screenY
    this._ox = this.props.x
    this._oy = this.props.y

    window.addEventListener('mousemove', this.handleMouseMove, false)
    window.addEventListener('mouseup', this.handleMouseUp, false)
  }

  @autobind
  handleMouseMove(e) {
    this.props.onDrag({
      x: e.screenX - this._screenX + this._ox,
      y: e.screenY - this._screenY + this._oy,
    })
  }

  @autobind
  handleMouseUp() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    return (
      <div className={className('dragger', this.props.className)}
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