'use strict'

const dnsServer = require('./dns')
const httpServer = require('./http')
const {dnsPort, httpPort} = require('./lib/config')
const logger = require('./lib/logger')

let a = '127.0.0.1'
let aaaa = '::1'

const getA = () => a
const getAAAA = () => aaaa

const setA = (ip) => {a = ip}
const setAAAA = (ip) => {aaaa = ip}



const dns = dnsServer(getA, getAAAA)
dns.listen(dnsPort, '::', (err) => {
	if (err) return showError(err)
	logger.info('DNS server listening.')
})

const http = httpServer(setA, setAAAA)
http.listen(httpPort, (err) => {
	if (err) return showError(err)
	logger.info('HTTP server listening.')
})
