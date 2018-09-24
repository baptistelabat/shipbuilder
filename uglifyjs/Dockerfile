FROM node:9.3-alpine

RUN npm config set unsafe-perm=true && npm install -g uglify-js@3.4.9

#ENTRYPOINT ["/bin/sh"]
ENTRYPOINT ["/usr/local/bin/uglifyjs"]
#["uglifyjs"]
