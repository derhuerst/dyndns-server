'use strict'

const parseAuthHeader = require('basic-auth')
const url = require('url')
const http = require('http')
const ipRegex = require('ip-regex')
const {key} = require('./lib/config')
const logger = require('./lib/logger')

const validateAuth = (req, res) => {
	const auth = parseAuthHeader(req)
	if (!auth || auth.pass !== key) {
		res.statusCode = 401
		res.end('Unauthorized.')
		logger.warn({auth}, 'Unauthorized.')
	} else return true
}

const validateMethod = (req, res) => {
	if (req.method !== 'PATCH') {
		res.statusCode = 405
		res.end('HTTP PATCH only.')
		logger.warn({method: req.method}, 'Invalid method.')
	} else return true
}

const validatePath = (req, res) => {
	const record = url.parse(req.url).pathname.slice(1).toUpperCase()
	if (record !== 'A' && record !== 'AAAA') {
		res.statusCode = 404
		res.end('/A and /AAAA only.')
		logger.warn({record}, 'Invalid record.')
	} else return record
}

const ipv4 = ipRegex.v4({exact: true})
const ipv6 = ipRegex.v6({exact: true})



const server = (setA, setAAAA) => {

	const server = http.createServer((req, res) => {
		if (!validateAuth(req, res)) return
		if (!validateMethod(req, res)) return
		const record = validatePath(req, res)
		if (!record) return

		let ip = ''
		req.on('data', (chunk) => ip += chunk.toString())
		req.on('end', () => {

			let p = Promise.resolve()
			if (record === 'A') {
				if (!ipv4.test(ip)) {
					res.statusCode = 400
					res.end('Invalid IPv4 address.')
					return
				}
				p = setA(ip)
			} else if (record === 'AAAA') {
				if (!ipv6.test(ip)) {
					res.statusCode = 400
					res.end('Invalid IPv6 address.')
					return
				}
				p = setAAAA(ip)
			}

			p
			.then(() => {
				logger.debug({record, ip}, 'Record set.')
				res.end(ip)
			})
			.catch((err) => {
				res.statusCode = err.statusCode || 500
				res.end(err ? err.message : ('' + err))
			})
		})
	})

	return server
}

module.exports = server
