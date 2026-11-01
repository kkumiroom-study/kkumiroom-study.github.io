#!/bin/bash
# Prepare a local copy of kumiroom.com for recording videos.
# usage: bash setup.sh <path to site checkout on main> <work dir>
set -e
SITE=${1:?site checkout}; WORK=${2:?work dir}; HERE=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$WORK/www/fs" "$WORK/music"
( cd "$HERE" && npm install --silent --no-audit --no-fund )
for f in index.html three.module.min.js mqtt.min.js icon-192.png icon-512.png apple-touch-icon.png manifest.webmanifest; do cp "$SITE/$f" "$WORK/www/"; done
cd "$WORK" && for p in gaegu gowun-batang ibm-plex-sans-kr; do [ -d "www/fs/$p" ] && continue; npm pack "@fontsource/$p@5" --silent >/dev/null; mkdir -p "www/fs/$p"; tar xzf fontsource-$p-*.tgz -C "www/fs/$p" --strip-components=1; rm -f fontsource-$p-*.tgz; done
# local broker (ws://127.0.0.1:8888) and web server (http://127.0.0.1:8767)
(cd "$HERE" && exec nohup node broker.js) </dev/null >/dev/null 2>&1 &
(cd "$WORK/www" && exec nohup python3 -m http.server 8767) </dev/null >/dev/null 2>&1 &
# procedural music beds (no files needed from anywhere): dawn piano, jazz, bossa, piano, chill
cp "$HERE/music/gen.html" "$WORK/music/"; node "$HERE/music/render.js" "$WORK/music" dawn,jazz,bossa,piano,chill 70
sleep 1; curl -s -o /dev/null -w "web %{http_code}\n" http://127.0.0.1:8767/
