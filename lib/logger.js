'use strict'

const pino = require('pino')
const {logLevel, domain, ttl} = require('./config')

const logger = pino({
	level: logLevel,
	base: {domain, ttl}
})

module.exports = logger
