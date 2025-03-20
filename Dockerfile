# Build stage
FROM node:20-alpine AS builder

# Accept build-time argument
ARG GOOGLE_TAG_MANAGER_ID
ENV GOOGLE_TAG_MANAGER_ID=$GOOGLE_TAG_MANAGER_ID

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install
COPY . . 
COPY ./prisma ./prisma  
RUN npx prisma generate  
RUN npm run build

# Run stage
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/prisma ./prisma 
RUN npm install --production
EXPOSE 3000

CMD ["npm", "start"]