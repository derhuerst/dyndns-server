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
	hostname: requiredConfig('HOSTNAME'),
	ttl: env.TTL ? parseInt(env.TTL) : 300,

	dnsPort: env.DNS_PORT ? parseInt(env.DNS_PORT) : 53,
	httpPort: env.HTTP_PORT ? parseInt(env.HTTP_PORT) : 8053,

	logLevel: process.env.LOG_LEVEL || 'debug'
}
