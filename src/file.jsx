import React, { PureComponent } from 'react'
import { autobind } from './utils'

export default class FilePicker extends PureComponent {
  constructor() {
    super()
    this.state = {
      key: 0
    }
  }

  @autobind
  handleChange() {
    this.props.onChange(this.refs.file.files[0])
    this.setState({
      key: this.state.key + 1
    })
  }

  render() {
    return (
      <label className="file">
        { this.props.children }
        <input type="file" key={this.state.key} ref="file" onChange={this.handleChange}/>
      </label>
    )
  }
}

FilePicker.defaultProps = {
  onChange() {}
}