'use strict'

const {env} = process

const requiredConfig = (name) => {
	if (env[name]) return env[name]
	console.error(`Missing ${name} env var.`)
	process.exit(1)
}

module.exports = {
	domain: requiredConfig('DOMAIN'),
	key: requiredConfig('KEY'),
	hostsFile: env.HOSTS_FILE || 'hosts',

	port: env.PORT ? parseInt(env.PORT) : 3000,

	logLevel: process.env.LOG_LEVEL || 'debug'
}
