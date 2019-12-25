'use strict'

const dnsSocket = require('dns-socket')
const {domain, ttl, hostname} = require('./lib/config')
const logger = require('./lib/logger')

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
			flags: dnsSocket.AUTHORITATIVE_ANSWER,
			answers: [],
			authorities: [{
				type: 'NS',
				class: 'IN',
				name: domain,
				ttl,
				data: hostname
			}]
		}

		for (const q of questions) {
			const address = resolvers[q.type]()
			if (address === null) continue

			const record = {
				type: q.type,
				class: q.class,
				name: domain,
				ttl,
				data: address
			}
			logger.debug({query: query.id, record}, 'Responding.')

			res.answers.push(record)
		}

		socket.response(query, res, port, host)
	})

	return {
		listen: socket.bind.bind(socket)
	}
}

module.exports = createServer
