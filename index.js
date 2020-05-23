'use strict'

const {promisify} = require('util')
const {writeFile} = require('fs')
const httpServer = require('./http')
const {
	domain,
	hostsFile,
	port,
} = require('./lib/config')
const logger = require('./lib/logger')

let a = null
let aaaa = null

const pWriteFile = promisify(writeFile)
const updateHostsFile = async () => {
	let body = ''
	if (a) body += `${a} ${domain}\n`
	if (aaaa) body += `${aaaa} ${domain}\n`
	logger.debug('writing hosts file', a, aaaa)
	await pWriteFile(hostsFile, body)
	logger.debug('wrote hosts file')
}

const setA = async (ip) => {
	a = ip
	await updateHostsFile()
}
const setAAAA = async (ip) => {
	aaaa = ip
	await updateHostsFile()
}

const http = httpServer(setA, setAAAA)

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

updateHostsFile()
.then(() => {
	http.listen(port, (err) => {
		if (err) return showError(err)
		logger.info('HTTP server listening.')
	})
})
.catch(showError)
