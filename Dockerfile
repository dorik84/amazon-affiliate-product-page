# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
# Ensure the lib directory and other necessary files are included
# COPY ./lib ./lib
RUN npm run build

# Run stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]