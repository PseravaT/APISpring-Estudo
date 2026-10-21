# Estágio 1: Build
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copia os arquivos do wrapper e descritor de dependências para cache
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Normaliza quebras de linha Windows (CRLF) e concede permissão de execução ao mvnw
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Copia o código-fonte e compila o pacote diretamente
COPY src ./src
RUN ./mvnw clean package -DskipTests -B && \
    cp target/*.jar app.jar

# Estágio 2: Execução com JRE enxuta
FROM eclipse-temurin:25-jre
WORKDIR /app

# Cria usuário não-root por boas práticas de segurança
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

# Copia o executável JAR do estágio de build
COPY --from=build --chown=spring:spring /app/app.jar app.jar

# Porta padrão do Spring Boot
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
