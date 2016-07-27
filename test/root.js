global.expect = require('expect')
const fs = require('fs')
const jsdom = require('mocha-jsdom')
const path = require('path')

const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8')
const src = fs.readFileSync(path.resolve(__dirname, '..', 'index.js'), 'utf-8')

jsdom({
  html,
  src,
  useEach: true,
})
