#!/usr/bin/env bash
set -euxo pipefail

node scripts/build-redirects.js

gatsby build
