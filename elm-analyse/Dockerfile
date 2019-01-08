FROM node:9.3-alpine

RUN npm config set unsafe-perm=true \
 && npm install -g elm-analyse@0.16.1 \
                   elm@0.19.0-bugfix2 \
                   elm-format@0.8.1

ENTRYPOINT ["/usr/local/bin/elm-analyse"]
