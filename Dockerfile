# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the .env.local file into the build context
COPY .env.local ./

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
COPY . . 
COPY ./prisma ./prisma  
RUN npx prisma generate  
# Build the Next.js app (Next.js will automatically load .env.local)
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