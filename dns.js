'use strict'

const named = require('named')
const cfg = require('config')

const server = (getA, getAAAA) => {
	const server = named.createServer()

	server.on('query', (q) => {
		const name = q.name()
		const record = q.type()

		if (name !== cfg.domain) return server.send(q)
		console.info('dns', Math.round(Date.now() / 1000), record)

		if (record === 'A')
			q.addAnswer(name, new named.ARecord(getA()), cfg.ttl)
		if (record === 'AAAA')
			q.addAnswer(name, new named.AAAARecord(getAAAA()), cfg.ttl)
		server.send(q)
	})

	return server
}

module.exports = server
