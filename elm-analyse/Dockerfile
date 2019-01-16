FROM node:9.3-alpine

RUN npm config set unsafe-perm=true \
 && npm install -g elm-analyse@0.16.1 \
                   elm@0.19.0-bugfix2 \
                   elm-format@0.8.1
RUN mv /usr/local/bin/elm-analyse /usr/local/bin/elm-analyse_
RUN mkdir -p /home/node/ && chown -R node /home/node/ && chmod a+x /home/node/ && chmod a+w -R /home/node/
RUN echo "#!/bin/sh" > /usr/local/bin/elm-analyse
RUN echo "cp -r .elm-analyse /home/node/" >> /usr/local/bin/elm-analyse
RUN echo "chmod a+x /home/node/.elm-analyse" >> /usr/local/bin/elm-analyse
RUN echo "chmod a+r -R /home/node/.elm-analyse" >> /usr/local/bin/elm-analyse
RUN echo "/usr/local/bin/elm-analyse_ $*" >> /usr/local/bin/elm-analyse
RUN chmod a+x /usr/local/bin/elm-analyse
ENTRYPOINT ["/bin/sh","/usr/local/bin/elm-analyse"]
