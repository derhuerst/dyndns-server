'use strict'

const named = require('named')
const cfg = require('config')

const ipv4 = '127.0.0.1'
const ipv6 = '::1'

const server = named.createServer()

server.on('query', (q) => {
	const name = q.name()
	const type = q.type()
	if (name !== cfg.domain) return server.send(q)
	console.info(Math.round(Date.now() / 1000) + ' ' + type)
	if (type === 'A') q.addAnswer(name, new named.ARecord(ipv4), cfg.ttl)
	if (type === 'AAAA') q.addAnswer(name, new named.AAAARecord(ipv6), cfg.ttl)
	server.send(q)
})

server.listen(cfg.port, 'localhost', (err) => {
	if (err) throw err
	console.info(`Listening at port ${cfg.port}.`)
})
