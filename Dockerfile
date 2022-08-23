FROM node:14.17.6

WORKDIR /usr/src/athman-api

COPY ./ ./

RUN yarn install

CMD ["/bin/bash"]