#!/bin/sh -e

rm -rf dist

./node_modules/.bin/webpack

cat dist/bundle.js | node_modules/.bin/babel \
  --plugins ../ > dist/bundle.new.js

PORT=8000 node dist/bundle.new.js
