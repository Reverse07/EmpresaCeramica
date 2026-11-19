# ---------- Argumentos de construcción ----------
ARG NODE_VERSION=20-alpine
ARG APP_VERSION=0.2.0

# ---------- Etapa 1: dependencias de producción ----------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- Etapa 2: imagen final (ligera y sin root) ----------
FROM node:${NODE_VERSION}

# Metadatos de la imagen
LABEL org.opencontainers.image.title="EmpresaCeramica" \
      org.opencontainers.image.description="API REST para gestión de empresa de cerámica" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.authors="RibauAlexander <u23242270@utp.edu.pe>" \
      org.opencontainers.image.source="https://github.com/Reverse07/EmpresaCeramica"

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# La imagen oficial de Node trae el usuario "node" sin privilegios de root
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
