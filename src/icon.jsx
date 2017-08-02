import React from 'react'
import PropTypes from 'prop-types'

require.context('./icons/', false).keys().forEach(file => {
  require('./icons/' + file.slice(2))
})

const Icon = props => (
  <svg className={`icon icon-${props.name}`}>
    <use xlinkHref={`#icon-${props.name}`} />
  </svg>
)

Icon.propTypes = {
  name: PropTypes.string,
}

export default Icon
