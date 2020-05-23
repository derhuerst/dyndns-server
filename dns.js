'use strict'

const dnsSocket = require('dns-socket')
const {
	domain, ttl,
	hostname,
	adminEmailDomain,
	soaTtl,
} = require('./lib/config')
const logger = require('./lib/logger')

const SOA = {
	name: domain,
	ttl,
	class: 'IN',
	type: 'SOA',
	data: {
		mname: hostname,
		rname: adminEmailDomain,
		serial: Date.now() / 1000 | 0,
		refresh: soaTtl,
		retry: Math.ceil(soaTtl / 2),
		expire: 1209600, // 14 days
		minimum: soaTtl,
	},
}

const createServer = (getA, getAAAA) => {
	const resolvers = Object.create(null)
	resolvers.A = getA
	resolvers.AAAA = getAAAA
	resolvers.NS = () => hostname

	const socket = dnsSocket()
	socket.on('query', (query, port, host) => {
		const questions = query.questions
		.filter(q => q.class === 'IN')
		// todo: support NS queries?
		// todo: support PTR queries?
		.filter(q => q.type === 'SOA' || !!resolvers[q.type])
		.filter(q => q.name === domain)

		const res = {
			flags: dnsSocket.AUTHORITATIVE_ANSWER,
			answers: [],
			authorities: [SOA],
		}

		for (const q of questions) {
			if (q.type === 'SOA') {
				res.answers.push(SOA)
				continue
			}

			const address = resolvers[q.type]()
			if (address === null) continue

			res.answers.push({
				type: q.type,
				class: q.class,
				name: domain,
				ttl,
				data: address
			})
		}

		logger.debug({query, response: res}, 'responding')
		socket.response(query, res, port, host)
	})

	return {
		listen: socket.bind.bind(socket)
	}
}

module.exports = createServer
