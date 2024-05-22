FROM node:20-alpine


WORKDIR /app

COPY  package.json yarn.lock ./

RUN yarn

COPY . .

# Declaring env
ENV NODE_ENV development
ENV HOST=0.0.0.0 PORT=3001

EXPOSE 3001

# Starting our application for dev
# CMD [ "node", "src/server.js" ]


# Starting our application
CMD pm2 start process.yml && tail -f /dev/null
