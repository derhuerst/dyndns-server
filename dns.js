'use strict'

const named = require('named')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const domain = process.env.DOMAIN
if (!domain) showError('Missing DOMAIN env var.')
const ttl = process.env.TTL || 300

const server = (getA, getAAAA) => {
	const server = named.createServer()

	server.on('query', (q) => {
		const name = q.name()
		const record = q.type()

		if (name !== domain) return server.send(q)
		console.info('dns', Math.round(Date.now() / 1000), record)

		if (record === 'A')
			q.addAnswer(name, new named.ARecord(getA()), ttl)
		if (record === 'AAAA')
			q.addAnswer(name, new named.AAAARecord(getAAAA()), ttl)
		server.send(q)
	})

	return server
}

module.exports = server
