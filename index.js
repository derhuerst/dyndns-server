'use strict'

const cfg = require('config')

const dnsServer = require('./dns')
const httpServer = require('./http')



let a = '127.0.0.1'
let aaaa = '::1'

const getA = () => a
const getAAAA = () => aaaa

const setA = (ip) => {a = ip}
const setAAAA = (ip) => {aaaa = ip}



const dns = dnsServer(getA, getAAAA)
dns.listen(cfg.dnsPort, 'localhost', (err) => {
	if (err) throw err
	console.info(`DNS server listening at port ${cfg.dnsPort}.`)
})

const http = httpServer(setA, setAAAA)
http.listen(cfg.httpPort, 'localhost', (err) => {
	if (err) throw err
	console.info(`HTTP server listening at port ${cfg.httpPort}.`)
})
