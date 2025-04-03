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

# Set environment variables
ENV GIT_HUB_ID=$GIT_HUB_ID \
    GIT_HUB_SECRET=$GIT_HUB_SECRET \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    NEXTAUTH_URL=$NEXTAUTH_URL \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_LOG_LEVEL=$NEXT_PUBLIC_LOG_LEVEL \
    NEXT_PUBLIC_STORE_NAME=$NEXT_PUBLIC_STORE_NAME \
    GOOGLE_TAG_MANAGER_ID=$GOOGLE_TAG_MANAGER_ID \
    DATABASE_URL=$DATABASE_URL

# Copy only package files first (cache dependencies)
COPY package*.json ./
RUN npm install

# Copy app code and build
COPY . .

# Create .env.local
RUN echo "GOOGLE_TAG_MANAGER_ID=$GOOGLE_TAG_MANAGER_ID" > .env.local && \
    echo "GIT_HUB_ID=$GIT_HUB_ID" >> .env.local && \
    echo "GIT_HUB_SECRET=$GIT_HUB_SECRET" >> .env.local && \
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.local && \
    echo "NEXTAUTH_URL=$NEXTAUTH_URL" >> .env.local && \
    echo "NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL" >> .env.local && \
    echo "NEXT_PUBLIC_LOG_LEVEL=$NEXT_PUBLIC_LOG_LEVEL" >> .env.local && \
    echo "NEXT_PUBLIC_STORE_NAME=$NEXT_PUBLIC_STORE_NAME" >> .env.local && \
    echo "DATABASE_URL=$DATABASE_URL" >> .env.local
COPY ./prisma ./prisma  
RUN npx prisma generate && npm run build

# Run stage
FROM node:20-alpine

WORKDIR /app

# Copy only what’s needed
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma  
COPY --from=builder /app/lib ./lib     

# Install production dependencies
RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]