#!/usr/bin/env bash
set -euxo pipefail

node scripts/build-redirects.js

GATSBY_EXPERIMENTAL_PAGE_BUILD_ON_DATA_CHANGES=true gatsby build
