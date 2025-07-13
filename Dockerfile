FROM node:18-alpine AS builder

ARG VITE_BYPASS_AUTH
ARG VITE_TEST_JWT
ARG VITE_API_BASE_URL

ENV VITE_BYPASS_AUTH=${VITE_BYPASS_AUTH}
ENV VITE_TEST_JWT=${VITE_TEST_JWT}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]