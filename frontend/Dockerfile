# Estágio 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Instala dependências aproveitando o cache de camadas do Docker
COPY package*.json ./
RUN npm ci

# Copia o código-fonte e gera os arquivos estáticos de produção
COPY . .
RUN npm run build

# Estágio 2: Execução com servidor Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Limpa o conteúdo padrão do Nginx
RUN rm -rf ./*

# Copia o bundle estático gerado no estágio de build
COPY --from=builder /app/dist .

# Configuração do Nginx com suporte a SPA e reverse proxy para as APIs
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
