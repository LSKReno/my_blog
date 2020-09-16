'use strict'

const fs = require('fs')

const files = fs.readdirSync(__dirname).filter(file => file !== 'index.js')

const sidebars = {}
for (const file of files) {
  if (file.toLowerCase().endsWith('js')) {
    const sidebar = require(`./${file}`)
	sidebars[`${file.replace(/\.js/, '_sidebar').replace(/-/g,'_')}`] = sidebar
  }
}

module.exports = sidebars
