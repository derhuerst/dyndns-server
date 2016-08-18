'use strict'

const cfg = require('config')

const dns = require('./dns')
const http = require('./http')

dns.listen(cfg.dnsPort, 'localhost', (err) => {
	if (err) throw err
	console.info(`DNS server listening at port ${cfg.dnsPort}.`)
})

http.listen(cfg.httpPort, 'localhost', (err) => {
	if (err) throw err
	console.info(`HTTP server listening at port ${cfg.httpPort}.`)
})
