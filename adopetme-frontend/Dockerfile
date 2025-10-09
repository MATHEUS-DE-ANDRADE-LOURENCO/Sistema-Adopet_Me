# Estágio 1: Build (Ambiente Node.js para compilar o código)
FROM node:20-alpine AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Executa o comando de build do Vite
# O output é geralmente na pasta 'dist'
RUN npm run build


# Estágio 2: Produção (Servir os arquivos estáticos via Nginx)
FROM nginx:alpine-slim AS production

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do Nginx (Criaremos isso abaixo)
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build gerados (a pasta 'dist')
COPY --from=build /app/dist /usr/share/nginx/html

# A porta padrão do Nginx é 80, que é a porta interna do container
EXPOSE 80

# O Nginx já é o comando padrão de start
CMD ["nginx", "-g", "daemon off;"]