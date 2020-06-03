#!/usr/bin/env bash
set -euxo pipefail

find redirects -type f -exec cat {} \; > static/_redirects

gatsby build
