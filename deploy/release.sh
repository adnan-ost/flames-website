#!/usr/bin/env bash
#
# Runs ON THE SERVER. Builds a new release and only switches the live symlink
# once the build has succeeded, so a broken commit can never take the site down.
#
#   /srv/flames/
#     repo/            bare-ish clone, only used to fetch source
#     shared/.env.local  secrets, never in git
#     releases/<sha>/  one directory per deploy
#     current -> releases/<sha>
#
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/flames}"
SHA="${1:?usage: release.sh <git-sha>}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

RELEASES="$APP_DIR/releases"
NEW="$RELEASES/$SHA"

echo "==> deploying $SHA"

# Node 20.9+ is required by Next 16. Fail loudly rather than mid-build.
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "!! Node $(node -v) is too old — Next 16 needs 20.9 or newer" >&2
  exit 1
fi

git -C "$APP_DIR/repo" fetch --quiet origin main
mkdir -p "$NEW"
git -C "$APP_DIR/repo" archive "$SHA" | tar -x -C "$NEW"

# Build-time env: NEXT_PUBLIC_* values are inlined during the build, so this
# has to be in place before npm run build, not just at runtime.
ln -sfn "$APP_DIR/shared/.env.local" "$NEW/.env.local"

cd "$NEW"
npm ci --no-audit --no-fund
npm run build

# Only now is the release considered good.
ln -sfn "$NEW" "$APP_DIR/current"
sudo systemctl restart flames
sleep 2

# Prove it actually came back up before declaring success.
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null http://127.0.0.1:3000/; then
    echo "==> live on $SHA"
    ls -1dt "$RELEASES"/*/ | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf
    exit 0
  fi
  sleep 1
done

echo "!! service did not answer after restart — check: journalctl -u flames -n 50" >&2
exit 1
