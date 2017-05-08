'use strict'

const dnsServer = require('./dns')
const httpServer = require('./http')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const dnsPort = process.env.DNS_PORT || 53
const httpPort = process.env.HTTP_PORT || 8053

let a = '127.0.0.1'
let aaaa = '::1'

const getA = () => a
const getAAAA = () => aaaa

const setA = (ip) => {a = ip}
const setAAAA = (ip) => {aaaa = ip}



const dns = dnsServer(getA, getAAAA)
dns.listen(dnsPort, '::', (err) => {
	if (err) return showError(err)
	console.info(`DNS server listening at port ${dnsPort}.`)
})

const http = httpServer(setA, setAAAA)
http.listen(httpPort, (err) => {
	if (err) return showError(err)
	console.info(`HTTP server listening at port ${httpPort}.`)
})
