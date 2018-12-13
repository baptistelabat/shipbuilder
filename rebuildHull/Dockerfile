FROM node:8.2.1-slim
RUN npm config set unsafe-perm=true \
 && npm install -g rollup
COPY fake-passwd /etc/passwd
ENTRYPOINT ["node"]
