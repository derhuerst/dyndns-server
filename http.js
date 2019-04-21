'use strict'

const auth = require('basic-auth')
const url = require('url')
const http = require('http')
const ipRegex = require('ip-regex')
const {key} = require('./lib/config')

const validateAuth = (req, res) => {
	const data = auth(req)
	if (!data || data.pass !== key) {
		res.statusCode = 401
		res.end('Unauthorized.')
	} else return true
}

const validateMethod = (req, res) => {
	if (req.method !== 'PATCH') {
		res.statusCode = 405
		res.end('HTTP PATCH only.')
	} else return true
}

const validatePath = (req, res) => {
	const record = url.parse(req.url).pathname.slice(1).toUpperCase()
	if (record !== 'A' && record !== 'AAAA') {
		res.statusCode = 404
		res.end('/A and /AAAA only.')
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

			if (record === 'A') {
				if (!ipv4.test(ip)) {
					res.statusCode = 400
					res.end('Invalid IPv4 address.')
				} else setA(ip)
			}
			if (record === 'AAAA') {
				if (!ipv6.test(ip)) {
					res.statusCode = 400
					res.end('Invalid IPv6 address.')
				} else setAAAA(ip)
			}

			console.info('http', Math.round(Date.now() / 1000), record, ip)
			res.end(ip)
		})
	})

	return server
}

module.exports = server
