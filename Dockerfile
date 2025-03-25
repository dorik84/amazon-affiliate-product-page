# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments
ARG GIT_HUB_ID
ARG GIT_HUB_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_LOG_LEVEL
ARG NEXT_PUBLIC_STORE_NAME
ARG GOOGLE_TAG_MANAGER_ID
ARG DATABASE_URL

# Set environment variables for the build
ENV GIT_HUB_ID=$GIT_HUB_ID \
    GIT_HUB_SECRET=$GIT_HUB_SECRET \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    NEXTAUTH_URL=$NEXTAUTH_URL \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_LOG_LEVEL=$NEXT_PUBLIC_LOG_LEVEL \
    NEXT_PUBLIC_STORE_NAME=$NEXT_PUBLIC_STORE_NAME \
    GOOGLE_TAG_MANAGER_ID=$GOOGLE_TAG_MANAGER_ID \
    DATABASE_URL=$DATABASE_URL

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .
COPY ./prisma ./prisma  

# Generate Prisma client
RUN npx prisma generate  

# Log the value of GOOGLE_TAG_MANAGER_ID before building
RUN echo "NEXT_PUBLIC_API_BASE_URL is: $NEXT_PUBLIC_API_BASE_URL"

# Build the Next.js app
RUN npm run build

# Run stage
FROM node:20-alpine

WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/prisma ./prisma 

# Install production dependencies
RUN npm install --production

EXPOSE 3000

CMD ["npm", "start"]