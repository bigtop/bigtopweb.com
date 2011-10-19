#! /usr/bin/env bash

rsync -ave ssh _site/* unweb:bigtopweb.com/public/htdocs/
