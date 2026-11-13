# 🐉 D&D Manager API

[![Java](https://img.shields.io/badge/Java-25-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5.svg)](https://kubernetes.io/)
[![OpenAPI](https://img.shields.io/badge/Swagger-OpenAPI%203-green.svg)](http://localhost:8080/swagger-ui.html)

API RESTful robusta desenvolvida em **Java 25** com **Spring Boot** para o gerenciamento de fichas de personagens de RPG baseadas nas regras de **Dungeons & Dragons (D&D 5.5e / 2024)**. O sistema faz parte de um ecossistema integrado que inclui uma interface Frontend e um microserviço dedicado para rolagem de dados (`APIdados`).

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura & Tecnologias](#-arquitetura--tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configurações de Ambiente](#-configurações-de-ambiente)
- [Como Executar](#-como-executar)
  - [Execução Local](#1-execução-local-maven)
  - [Execução com Docker](#2-execução-com-docker)
  - [Execução com Kubernetes](#3-execução-no-kubernetes)
- [Documentação da API (Endpoints)](#-documentação-da-api-endpoints)
- [Segurança & Boas Práticas](#-segurança--boas-práticas)
- [Testes](#-testes)

---

## 📖 Visão Geral

O **D&D Manager** permite que jogadores e mestres criem contas seguras, autentiquem-se via JSON Web Tokens (JWT) e gerenciem seus personagens de forma persistente. A aplicação é totalmente desacoplada, utilizando migrações automáticas de banco de dados via Flyway, documentação viva via Swagger/OpenAPI e suporte nativo a contêineres e orquestração via Kubernetes.

---

## ✨ Funcionalidades

- **Gestão de Usuários**: Cadastro com validação de dados, unicidade de e-mail e hash seguro de senha via BCrypt.
- **Autenticação JWT Stateless**: Emissão e validação de tokens JWT (HMAC-256) com tempo de expiração configurável.
- **Gerenciamento de Fichas de Personagem**:
  - Registro de raça, classe, subclasse, nível (1 a 20), HP e Classe de Armadura (CA).
  - Controle dos 6 atributos clássicos de D&D: Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma.
  - Vínculo direto de cada ficha com o usuário autenticado.
- **Integração com Microsserviço de Rolagens**: Endpoint `/personagens/rolagens` consome o serviço externo `APIdados` para geração de atributos randômicos baseados nas regras oficiais de dados.
- **Auditoria de Dados**: Rastreamento automático de criação (`criado_em`), atualização (`atualizado_em`) e status ativo (`ativo`) via JPA Auditing.
- **Documentação Interativa**: Swagger UI integrada com autenticação Bearer Token.

---

## 🛠 Arquitetura & Tecnologias

- **Linguagem**: Java 25
- **Framework**: Spring Boot 4.1.1
- **Módulos Spring**:
  - Spring Web MVC
  - Spring Data JPA (Hibernate)
  - Spring Security (Autenticação Stateless com JWT)
  - Spring Validation (Bean Validation)
- **Segurança & Criptografia**:
  - `com.auth0:java-jwt (4.4.0)`
  - `BCryptPasswordEncoder`
- **Banco de Dados & Migrações**:
  - PostgreSQL
  - Flyway Migration (`db/migration`)
  - Banco em memória H2 (para suíte de testes)
- **Documentação de API**: Springdoc OpenAPI v2.8.13
- **Containerização & Orquestração**:
  - Docker (Multi-stage build com usuário não-root `spring:spring`)
  - Kubernetes (Deployments, Services ClusterIP, Secrets, Probes de liveness e readiness)

---

## 📂 Estrutura do Projeto

```text
dndmanager/
├── .env.example             # Modelo das variáveis de ambiente necessárias
├── .gitignore               # Configurações de exclusão do Git
├── .dockerignore            # Otimização do contexto de build do Docker
├── Dockerfile               # Build multi-estágio da aplicação (Temurin JDK 25 -> JRE 25)
├── deployment.yaml          # Manifesto Kubernetes: Deployment e Pods
├── service.yaml             # Manifesto Kubernetes: Service ClusterIP
├── pom.xml                  # Gerenciador de dependências Maven
├── postman/                 # Coleções e ambientes Postman para testes da API
├── src/
│   ├── main/
│   │   ├── java/com/cesmac/dndmanager/
│   │   │   ├── config/      # Configurações de Segurança, CORS, OpenAPI e RestTemplate
│   │   │   ├── controller/  # Controladores REST (Auth, Usuários, Personagens)
│   │   │   ├── dto/         # Records DTO de entrada e saída com Swagger Schemas
│   │   │   ├── entity/      # Entidades JPA (Usuario, Personagem) com UserDetails
│   │   │   ├── exception/   # Handler global de exceções (RFC 7807)
│   │   │   ├── mapper/      # Conversores entre Entidades e DTOs
│   │   │   ├── repository/  # Interfaces Spring Data JPA
│   │   │   └── service/     # Regras de negócio e serviços de Token
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/ # Scripts versionados SQL (V1, V2, V3)
│   └── test/                # Testes unitários e de integração
```

---

## ⚙️ Configurações de Ambiente

A aplicação utiliza variáveis de ambiente para isolar segredos e configurações por ambiente. Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

### Variáveis Disponíveis

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DB_URL` | URL JDBC de conexão com o banco de dados PostgreSQL | `jdbc:postgresql://localhost:5432/dnd_manager` |
| `DB_USERNAME` | Usuário do banco PostgreSQL | `postgres` |
| `DB_PASSWORD` | Senha do banco PostgreSQL | `postgres` |
| `JWT_SECRET` | Chave secreta HMAC-256 para assinatura dos tokens JWT | *Chave base64 segura* |
| `JWT_EXPIRATION` | Tempo de expiração do token em **horas** | `2` (para 2 horas) ou `24` |
| `CORS_ALLOWED_ORIGINS` | Origens autorizadas pelo CORS (separadas por vírgula) | `http://localhost:3000` |
| `APIDADO_URL` | Endpoint da API de rolagem de dados | `http://localhost:8081/api/rolagens/atributos` |
| `SPRING_PROFILES_ACTIVE` | *(Opcional)* Perfil ativo do Spring (`local`, `prod`, etc.) | `local` |

> ⚠️ **Atenção**: Nunca versione o arquivo `.env` no Git. Ele está listado no `.gitignore` por motivos de segurança.

---

## 🚀 Como Executar

### 1. Execução Local (Maven)

**Pré-requisitos**:
- Java 25 JDK instalado
- PostgreSQL em execução na porta `5432` com o banco `dnd_manager` criado

Execute o projeto via wrapper do Maven:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

A API estará disponível em: `http://localhost:8080`.

### 2. Execução com Docker

A aplicação conta com um `Dockerfile` otimizado em **dois estágios**, garantindo que o artefato final contenha apenas o JRE mínimo e execute sob um usuário sem privilégios de root (`spring:spring`):

```bash
# Compilar a imagem Docker
docker build -t dndmanager:1.0.0 .

# Executar o contêiner
docker run -d -p 8080:8080 --name dndmanager-api \
  --env-file .env \
  dndmanager:1.0.0
```

### 3. Execução no Kubernetes

Manifestos prontos para Kubernetes encontram-se em `deployment.yaml` e `service.yaml`:

```bash
# Criar a Secret com as credenciais
kubectl create secret generic dndmanager-secret \
  --from-literal=db-url="jdbc:postgresql://postgres-service:5432/dnd_manager" \
  --from-literal=db-username="postgres" \
  --from-literal=db-password="sua_senha" \
  --from-literal=jwt-secret="sua_chave_jwt_secreta"

# Aplicar o Deployment e o Service
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Verificar os recursos criados
kubectl get pods -l app=dndmanager
kubectl get svc -l app=dndmanager
```

---

## 📡 Documentação da API (Endpoints)

Ao rodar a aplicação, acesse a documentação interativa pelo navegador:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Resumo das Rotas

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/usuarios` | Pública | Cadastra um novo usuário no sistema |
| `GET` | `/usuarios/me` | Requer Token | Verifica o status da autenticação atual |
| `POST` | `/auth/login` | Pública | Realiza login e retorna o Token JWT |
| `POST` | `/personagens` | Requer Token | Cria uma nova ficha de personagem |
| `GET` | `/personagens` | Requer Token | Lista todos os personagens do usuário logado |
| `GET` | `/personagens/rolagens` | Requer Token | Consulta rolagens de atributos da API externa |

---

## 🔒 Segurança & Boas Práticas

1. **Tokens JWT com Header Bearer**:
   - As requisições para rotas protegidas devem incluir o header:
     ```http
     Authorization: Bearer <seu_token_jwt>
     ```
   - O filtro `SecurityFilter` realiza a verificação rigorosa do formato antes de validar a assinatura HMAC-256.
2. **CORS Dinâmico**:
   - As origens aceitas são parametrizadas via `CORS_ALLOWED_ORIGINS`, suportando credenciais (`allowCredentials: true`).
3. **Criptografia de Senhas**:
   - Senhas são criptografadas com `BCryptPasswordEncoder` antes da persistência.
4. **Tratamento Padronizado de Erros**:
   - `GlobalExceptionHandler` intercepta erros de validação (`400 Bad Request`) e conflitos de regras de negócio (`409 Conflict`), retornando um payload uniforme (`StandardErrorDTO`).
5. **Execução Segura em Contêineres**:
   - O contêiner Docker roda como usuário restrito `spring:spring`, evitando privilégios de root em produção.

---

## 🧪 Testes

A suíte de testes inclui testes unitários de serviços e testes de integração com banco em memória H2:

```bash
# Executar a suíte de testes
.\mvnw.cmd test
```

---

## 👥 Autores & Contribuição

Desenvolvido para fins de estudo e gerenciamento de mesas de RPG do sistema Dungeons & Dragons. Sinta-se à vontade para abrir issues ou pull requests!
