'use strict'

const auth = require('http-auth')
const http = require('http')
const cfg = require('config')

const protect = auth.basic({}, (user, key, cb) => cb(key === cfg.key))

const server = http.createServer(protect, (req, res) => {
	res.end('foo')
})

module.exports = server
