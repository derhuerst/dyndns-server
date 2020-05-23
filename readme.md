# dyndns-server

**A small dynamic DNS server.** Writes a [hosts file](http://man7.org/linux/man-pages/man5/hosts.5.html) with 1 IPv4 & 1 IPv6 address.

[![dependency status](https://img.shields.io/david/derhuerst/dyndns-server.svg)](https://david-dm.org/derhuerst/dyndns-server)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/dyndns-server.svg)](https://david-dm.org/derhuerst/dyndns-server#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/dyndns-server.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)


## Installing

```bash
git clone https://github.com/derhuerst/dyndns-server.git
cd dyndns-server
npm install --production
```

Or using Docker:

```shell
docker run -d -p 3000:3000 derhuerst/dyndns-server
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
# ip4=$(curl -s 'https://api.ipify.org')
ip4='1.2.3.4'
curl -X PATCH "http://$HOSTNAME:8053/A" -u "user:$KEY" -d $ip4

# ip6=$(curl -s 'https://api6.ipify.org')
ip6='::f0'
curl -X PATCH "http://$HOSTNAME:8053/AAAA" -u "user:$KEY" -d $ip6
```

Verify that `dyndns-server` has written a correct hosts file using `cat hosts`:

```
1.2.3.4 awesome.horse
::f0 awesome.horse
```

Use a DNS server that picks up the hosts file, e.g. [CoreDNS](https://coredns.io) with the [`hosts` plugin](https://coredns.io/plugins/hosts/). Verify that it returns the correct IP addresses:

```shell
dig +short @dyndns.example.org awesome.horse A
dig -6 +short @dyndns.example.org awesome.horse AAAA
```

Verify that the whole dynamic DNS setup works:

```shell
ping awesome.horse
ping6 awesome.horse
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/dyndns-server/issues).
