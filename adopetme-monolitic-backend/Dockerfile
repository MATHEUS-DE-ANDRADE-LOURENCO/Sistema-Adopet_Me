# Estágio 1: Build (Ambiente Maven para compilar o projeto)
FROM maven:3.9.5-eclipse-temurin-17 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o código-fonte
COPY . .

# Executa o build do Maven. O pacote final (JAR) estará em target/
RUN mvn clean package -DskipTests


# Estágio 2: Produção (Ambiente JRE para rodar o JAR)
# Usamos a imagem slim para ter o menor tamanho possível
FROM eclipse-temurin:17-jre-alpine

# Define o diretório de trabalho
WORKDIR /app

# Define a porta interna do Spring Boot
EXPOSE 8081

# Copia o JAR do estágio 'build'. Usamos o nome do arquivo que você forneceu.
# Garante que o JAR seja copiado de forma eficiente e segura.
COPY --from=build /app/target/adopetme-monolitic-backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Comando para rodar a aplicação Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]