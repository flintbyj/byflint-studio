#!/bin/sh
# Build the site and make a copy that can be published as a Claude preview page.
set -e
npx next build >/dev/null
rm -rf preview && cp -r out preview && cd preview && mv _next nx
grep -rl "/_next/" . | xargs sed -i 's#/_next/#./nx/#g'
grep -rl '"/logos/' . | xargs -r sed -i 's#"/logos/#"./logos/#g'
echo "preview ready"
