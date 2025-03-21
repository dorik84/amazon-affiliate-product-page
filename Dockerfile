# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments
ARG GIT_HUB_ID
ARG GIT_HUB_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_LOG_LEVEL
ARG GOOGLE_TAG_MANAGER_ID
ARG DATABASE_URL


# Set environment variables
ENV GIT_HUB_ID=$GIT_HUB_ID
ENV GIT_HUB_SECRET=$GIT_HUB_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXT_PUBLIC_LOG_LEVEL=$NEXT_PUBLIC_LOG_LEVEL
ENV GOOGLE_TAG_MANAGER_ID=$GOOGLE_TAG_MANAGER_ID
ENV DATABASE_URL=$DATABASE_URL


# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
COPY . . 
COPY ./prisma ./prisma  
RUN npx prisma generate  
# Build the Next.js app
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