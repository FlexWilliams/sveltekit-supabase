#!/bin/bash

npm run build-prod && \
podman build --tag=vouch-for-me -f ./Dockerfile