# Stage 1: Build Environment
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build Arguments (must be passed in gcloud command)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GEMINI_API_KEY

# Set as ENV for the build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Run build with more memory to prevent OOM crashes
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Stage 2: Production Server
FROM nginx:alpine
# Copy built files from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
