# Build stage

FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN yarn build

# Production stage

RUN yarn cache clean

EXPOSE 3423

CMD [ "yarn", "start" ] 