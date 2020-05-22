# dyndns-server

**A small dynamic DNS server.**

[![npm version](https://img.shields.io/npm/v/dyndns-server.svg)](https://www.npmjs.com/package/dyndns-server)
[![dependency status](https://img.shields.io/david/derhuerst/dyndns-server.svg)](https://david-dm.org/derhuerst/dyndns-server)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/dyndns-server.svg)](https://david-dm.org/derhuerst/dyndns-server#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/dyndns-server.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```bash
git clone https://github.com/derhuerst/dyndns-server.git
cd dyndns-server
npm install --production
```

Or using Docker:

```shell
docker run -d -p 53:53 -p 8053:8053 derhuerst/dyndns-server
```


## Usage

```shell
DOMAIN=awesome.horse
KEY=super-secret
HOSTNAME=dyndns.example.org
```

Start the server:

```shell
npm start
```

Set the IP addresses via HTTP (or use [`dyndns-client`](https://www.npmjs.com/package/dyndns-client)):

```shell
ip4=$(curl -s 'https://api.ipify.org')
curl -X PATCH "http://$HOSTNAME:8053/A" -u "user:$KEY" -d $ip4

ip6=$(curl -s 'https://api6.ipify.org')
curl -X PATCH "http://$HOSTNAME:8053/AAAA" -u "user:$KEY" -d $ip6
```

Verify that the server returns the correct IP addresses:

```shell
dig +short @dyndns.example.org awesome.horse A
dig +short @dyndns.example.org awesome.horse AAAA
```

Verify that the whole dynamic DNS setup works:

```shell
ping awesome.horse
ping6 awesome.horse
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/dyndns-server/issues).
