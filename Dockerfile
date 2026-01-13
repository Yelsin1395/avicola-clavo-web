# Stage 1: Build de Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml generate-proxy.config.js ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build de producción
RUN pnpm build

# Stage 2: Nginx para servir la aplicación
FROM nginx:1.27-alpine

# Build-time metadata (via --build-arg)
ARG BUILD_DATE
ARG VERSION
ARG COMMIT_SHA
ARG ENVIRONMENT
ARG NODE_ENV
ARG API_BASE_URL
ARG API_VERSION

# Export args as environment variables (runtime)
ENV BUILD_DATE=${BUILD_DATE} \
    VERSION=${VERSION} \
    COMMIT_SHA=${COMMIT_SHA} \
    ENVIRONMENT=${ENVIRONMENT} \
    NODE_ENV=${NODE_ENV:-production} \
    API_BASE_URL=${API_BASE_URL} \
    API_VERSION=${API_VERSION}

# Instalar OpenSSL y certificados actualizados
RUN apk add --no-cache \
    ca-certificates \
    openssl \
    && update-ca-certificates

# Copiar archivos compilados
COPY --from=build /app/dist/avicola-clavo-web/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
