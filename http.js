'use strict'

const http = require('http')
const cfg = require('config')

const server = http.createServer((req, res) => {
	res.end('foo')
})

module.exports = server
