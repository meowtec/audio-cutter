import React from 'react'
import iconPrefix from './icon.svg'

export default props => (
  <svg className={`icon icon-${props.name}`}>
    <use xlinkHref={`#${iconPrefix}${props.name}`}></use>
  </svg>
)
