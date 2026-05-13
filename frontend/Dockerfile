# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# We will use Nginx to serve the frontend, but we'll define that in the docker-compose file
# using the nginx container directly mapping the dist folder. 
# Alternatively, we can build a standalone frontend nginx container:
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Note: Since we are using a central Nginx reverse proxy, this Dockerfile builds an Nginx container
# that just serves the static files. However, an even simpler approach is let the main Nginx
# serve these files. For this setup, we'll let this container serve them and the main proxy will route to it.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
