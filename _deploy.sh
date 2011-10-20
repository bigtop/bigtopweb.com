#! /usr/bin/env bash

jekyll --no-auto --no-server

rsync -ave ssh _site/* unweb:bigtopweb.com/public/htdocs/
