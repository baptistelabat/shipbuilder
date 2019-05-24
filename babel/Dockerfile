FROM node:9.3-alpine

WORKDIR /app
COPY shipbuilder-package.json /app/package.json
RUN npm config set strict-ssl false && npm install

COPY babel-entrypoint.sh /usr/local/bin/
RUN ln -s usr/local/bin/babel-entrypoint.sh / # backwards compat
RUN chmod a+x /usr/local/bin/babel-entrypoint.sh
RUN chmod a+rw /app
ENTRYPOINT sh /usr/local/bin/babel-entrypoint.sh
