ARG NODE_VERSION=18.14.2

# use node slim image as build image
FROM node:${NODE_VERSION}-slim as builder

# create work directory in app folder
WORKDIR /app

# install required packages for node image
RUN apt-get update && apt-get install -y openssh-client g++ make python3 git

# copy over package.json files
COPY package*.json /app/
COPY pnpm-lock.yaml /app/

# install pnpm
RUN npm install -g pnpm

# install all depencies
RUN pnpm install --frozen-lockfile && pnpm store prune

# copy over all files to the work directory
ADD . /app

# build the project
RUN pnpm build

# start final image
FROM node:${NODE_VERSION}-slim

WORKDIR /app

# copy over build files from builder step
# COPY --from=builder /app  /app
COPY --from=builder /app/.output /app/.output

# expose the host and port 3000 to the server
ENV HOST 0.0.0.0
EXPOSE 3000

# run the build project with node
ENTRYPOINT ["node", ".output/server/index.mjs"]