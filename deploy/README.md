# Deploying to the dedicated server

Push to `main` → GitHub Actions SSHes in → the server builds the new commit →
the live symlink only moves if the build succeeded. A broken commit cannot take
the site down.

## One-time server setup

Run as root on the GoDaddy box.

```bash
# 1. Node 20.9+ (Next 16 requires it; the release script refuses to build otherwise)
node -v

# 2. A user that owns the app, with no login shell needed for anything else
adduser --system --group --home /srv/flames flames

# 3. Directory layout
mkdir -p /srv/flames/{releases,shared}
git clone https://github.com/adnan-ost/flames-website.git /srv/flames/repo
chown -R flames:flames /srv/flames

# 4. Secrets. NEXT_PUBLIC_* are inlined at build time, so they must be here
#    before the first build. The write token is NOT needed — the site never
#    reads it, only the local seed/sync scripts do.
cat > /srv/flames/shared/.env.local <<'ENV'
NEXT_PUBLIC_SANITY_PROJECT_ID=byr90f6b
NEXT_PUBLIC_SANITY_DATASET=production
ENV
chown flames:flames /srv/flames/shared/.env.local
chmod 600 /srv/flames/shared/.env.local

# 5. Service
cp /srv/flames/repo/deploy/flames.service /etc/systemd/system/
systemctl daemon-reload && systemctl enable flames

# 6. Let the deploy user restart the service without a password
echo 'flames ALL=(root) NOPASSWD: /bin/systemctl restart flames' > /etc/sudoers.d/flames
chmod 440 /etc/sudoers.d/flames

# 7. First release by hand, to prove the pipeline before wiring CI
sudo -u flames APP_DIR=/srv/flames /srv/flames/repo/deploy/release.sh "$(git -C /srv/flames/repo rev-parse origin/main)"

# 8. nginx
cp /srv/flames/repo/deploy/nginx.conf.example /etc/nginx/conf.d/flames.conf
# edit server_name / certificate paths, then:
certbot --nginx -d flamesbytheindus.com -d www.flamesbytheindus.com
nginx -t && systemctl reload nginx
```

## GitHub secrets

Repo → Settings → Secrets and variables → Actions:

| Secret | Value |
| --- | --- |
| `DEPLOY_HOST` | the server's hostname or IP |
| `DEPLOY_USER` | `flames` |
| `DEPLOY_SSH_KEY` | private half of a key whose public half is in `/srv/flames/.ssh/authorized_keys` |
| `DEPLOY_KNOWN_HOSTS` | output of `ssh-keyscan -H <host>` |

Generate the key **for this purpose only** — do not reuse a personal key:

```bash
ssh-keygen -t ed25519 -N '' -C 'github-deploy' -f ./flames-deploy
# public half onto the server:
sudo -u flames mkdir -p /srv/flames/.ssh
sudo -u flames tee -a /srv/flames/.ssh/authorized_keys < ./flames-deploy.pub
# private half into DEPLOY_SSH_KEY, then delete your local copy
```

`DEPLOY_KNOWN_HOSTS` is pinned deliberately: without it the deploy would trust
whatever host answers, so a hijacked DNS record could capture the SSH session.

## Day to day

Nothing. Push to `main` and the change is live in a couple of minutes. The
Actions tab shows progress, and the workflow fails loudly if the site does not
return 200 afterwards.

Re-deploy without a commit: Actions → Deploy → Run workflow.

Roll back: releases are kept (last 5). On the server, point `current` at the
previous SHA and `sudo systemctl restart flames`.

## What still runs from a laptop, not from CI

`npm run sanity:seed` and `npm run sanity:prices` need `SANITY_API_WRITE_TOKEN`,
which deliberately does not live on the server. They are content operations, not
deploys, and are rare.
