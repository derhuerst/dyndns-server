'use strict'

const dnsSocket = require('dns-socket')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const domain = process.env.DOMAIN
if (!domain) showError('Missing DOMAIN env var.')
const ttl = process.env.TTL || 300

const createServer = (getA, getAAAA) => {
	const resolvers = Object.create(null)
	resolvers.A = getA
	resolvers.AAAA = getAAAA

	const socket = dnsSocket()
	socket.on('query', (query, port, host) => {
		const questions = query.questions
		.filter(q => q.class === 'IN')
		.filter(q => !!resolvers[q.type])
		.filter(q => q.name === domain)

		const res = {
			questions,
			flags: dnsSocket.AUTHORITATIVE_ANSWER,
			answers: [],
			authorities: []
		}

		for (const q of questions) {
			console.info('dns', Math.round(Date.now() / 1000), q.type)

			const record = {
				type: q.type,
				class: q.class,
				name: domain,
				ttl,
				data: resolvers[q.type]()
			}
			res.answers.push(record)
			res.authorities.push(record)
		}

		socket.response(query, res, port, host)
	})

	return {
		listen: socket.bind.bind(socket)
	}
}

module.exports = createServer
