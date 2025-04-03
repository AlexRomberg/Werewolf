#!/usr/bin/env bash

cd "$(dirname "$0")"
npm run extract-i18n;
if [ $? -ne 0 ]; then
  echo "Error: Failed to extract i18n strings."
  exit 1
fi

node ./sync-i18n.js