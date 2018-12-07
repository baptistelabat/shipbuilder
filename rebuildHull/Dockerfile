FROM node:8.2.1-slim
WORKDIR /work
RUN npm config set unsafe-perm=true \
 && npm install -g rollup
RUN mkdir -p /work
ADD package.json /work
RUN npm install
ENTRYPOINT rollup -c
