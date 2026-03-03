# ---------- Stage 1: Build ----------
FROM node:22-alpine AS build

WORKDIR /app

# Copiar dependencias primero (cache de capas)
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:1.27-alpine

# Valor por defecto (puede sobreescribirse en runtime via docker-compose o K8s)
ENV BACKEND_URL=http://backend:8080

# Copiar template de nginx (envsubst lo procesa al arrancar el contenedor)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copiar archivos compilados desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
