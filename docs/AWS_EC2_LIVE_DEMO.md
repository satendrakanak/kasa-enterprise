# AWS EC2 Live Demo Deployment

This guide runs Kasa Enterprise on the shared AWS EC2 demo server.

## DNS

Point these records to the EC2 public IPv4 address:

```text
enterprise.getkasa.in      A      YOUR_EC2_PUBLIC_IP
enterprise-api.getkasa.in  A      YOUR_EC2_PUBLIC_IP
```

## Ports

Only expose `80`, `443`, and SSH in the AWS Security Group.

The enterprise stack uses host ports `3100` and `8100` only for the shared Caddy reverse proxy on the same EC2 instance.

## Deploy

```bash
cd /opt/kasa
git clone https://github.com/satendrakanak/kasa-enterprise.git
cd kasa-enterprise
cp deploy/aws/.env.production.example deploy/aws/.env.production
nano deploy/aws/.env.production
./scripts/aws-live-up.sh
./scripts/aws-live-seed-demo.sh
```

## Shared Caddy Routes

Add these routes to the shared proxy:

```caddyfile
enterprise.getkasa.in {
  encode zstd gzip
  reverse_proxy 172.31.16.104:3100
}

enterprise-api.getkasa.in {
  encode zstd gzip
  reverse_proxy 172.31.16.104:8100
}
```

Use the EC2 private IP shown by `hostname -I`.

## Demo Logins

```text
Admin: admin@codewithkasa.demo
Faculty: faculty@codewithkasa.demo
Student: learner@codewithkasa.demo
Password: Demo@12345
```
