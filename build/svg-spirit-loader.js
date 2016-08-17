module.exports = function (content) {
  this.cacheable && this.cacheable()
  this.value = content

  var prefix = 'i-' + Date.now().toString(36) + '-'
  var xml = content.replace(/\ id\s*=\s*"/g, ` id="${prefix}`)

  return `
    var el = document.createElement('div')
    el.innerHTML = ${JSON.stringify(xml)}
    var svg = el.children[0]
    svg.style.display = 'none'
    document.body.appendChild(svg)
    module.exports = "${prefix}"
  `
}
