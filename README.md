**Nome do Projeto**

# 🐾 Adopet.me

## 👥 Nome do Projeto

**Adopet.me**

---

## 👨‍👩‍👧‍👦 Integrantes do Grupo

- Danilo Yui Honda
- Luis Felipe Basacchi Darre
- Matheus de Andrade Lourenço
- Murillo Cardoso Ferreira
- Pietro Zanaga Neto

---

## 📄 Detalhes do Projeto

### 🐶 Contexto de Negócio

O Adopet.me é uma plataforma digital que centraliza e formaliza o processo de adoção de animais. O objetivo é aumentar a visibilidade das ONGs, reduzir a superlotação dos abrigos e facilitar a conexão entre adotantes e instituições, além de oferecer um canal de denúncias para abandono e maus-tratos.

### 🎯 Público-alvo

- Pessoas interessadas em adotar animais
- ONGs e abrigos
- Voluntários
- Órgãos públicos e parceiros

### 📝 Objetivos Principais

- Aumentar visibilidade de animais e ONGs
- Tornar o processo de adoção mais seguro e transparente
- Reduzir superlotação de abrigos
- Fornecer canal de denúncias com protocolo e acompanhamento

---

## 🧭 Requisitos (Resumo)

- ✅ Cadastro e autenticação de usuários e ONGs
- ✅ Cadastro e gerenciamento de animais (fotos, histórico)
- ✅ Busca com filtros (espécie, idade, porte, localização)
- ✅ Área administrativa para ONGs
- ✅ Canal de denúncias (descrição, fotos, vídeos, localização)
- ✅ Notificações para acompanhamento

---

## 🏗️ Documentação Técnica

### 🏛 Arquitetura Geral

- Monorepo com dois módulos principais:
  - `adopetme-frontend` (UI)
  - `adopetme-monolitic-backend` (API)
- Comunicação via REST/JSON
- Camadas: UI → API → Persistência → Infraestrutura

### 🖥️ Frontend

- Local: `adopetme-frontend`
- Tech stack: React + TypeScript + Vite
- Responsabilidades: UI/UX, rotas, consumo das APIs, upload de imagens, sessões

### ⚙️ Backend

- Local: `adopetme-monolitic-backend`
- Tech stack: Java 17, Spring Boot, Spring Data JPA, Flyway, JWT
- Responsabilidades: autenticação, CRUD de usuários/ONGs/animais, denúncias, lógica de negócio, persistência

### 🗄️ Banco de Dados

- Produção: PostgreSQL (migrations em `src/main/resources/db/migration` via Flyway)
- Testes/Local: H2 (in-memory) — recomendado para CI

### 🐳 Docker

- Arquivos: `docker-compose.yml`, `docker-compose.dev.yml`
- Objetivo: orquestrar frontend, backend e banco em ambiente local ou de demonstração

### 🧪 Testes & CI

- Testes: JUnit 5, Mockito, Spring Boot Test (quando necessário)
- Boas práticas: unit tests sem `@SpringBootTest` sempre que possível; para testes que carregam contexto, criar `application-test.properties` com H2
- CI (Jenkins): usar profile `test` no `mvn test` para evitar dependência de PostgreSQL, ou executar um container PostgreSQL nos pipelines

---

## 🛠️ Manual de Instalação

### 🔎 Requisitos gerais

- Java 17 (OpenJDK 17)
- Maven 3.6+
- Node.js 16+ (npm ou Yarn)
- Docker & docker-compose (opcional)

### 🐧 Linux / WSL (Debian / Ubuntu)

```bash
# instalar Java 17
sudo apt update && sudo apt install -y openjdk-17-jdk

# instalar Maven
sudo apt install -y maven

# instalar Node.js (exemplo NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# instalar Docker
sudo apt-get install -y docker.io docker-compose

# rodar frontend (modo dev)
cd adopetme-frontend
npm ci
npm run dev

# rodar backend (modo dev)
cd ../adopetme-monolitic-backend
./mvnw spring-boot:run   # ou: mvn spring-boot:run
```

### 🍎 macOS (Homebrew)

```bash
brew install openjdk@17 maven node docker
export JAVA_HOME=$(brew --prefix openjdk@17)/libexec/openjdk.jdk/Contents/Home

# frontend
cd adopetme-frontend
npm ci
npm run dev

# backend
cd ../adopetme-monolitic-backend
mvn spring-boot:run
```

### 🪟 Windows

- Recomenda-se usar WSL2 (Ubuntu) para compatibilidade de ferramentas. Seguir passos semelhantes aos do Linux.

---

## 🚀 Executando com Docker (Demo / Local)

```bash
# na raiz do repositório
docker-compose -f docker-compose.dev.yml up --build
```

Isso levanta frontend, backend e banco conforme configurado.

---

## ✅ Executando Testes Localmente

Preferir o profile `test` com H2 para evitar dependência de PostgreSQL:

```bash
# com wrapper
./mvnw -Dspring.profiles.active=test -Dspring.flyway.enabled=false test

# ou usando mvn com JAVA_HOME
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn -Dspring.profiles.active=test -Dspring.flyway.enabled=false test
```

Sugestão para ambientes com problemas de permissão em `~/.m2`:

```bash
mvn -Dmaven.repo.local=$PWD/.m2/repository test
```

---

## 🧭 Manual de Utilização (Fluxos Principais)

### 🐾 Usuário (Adotante)

1. Acessar **Buscar Animais**
2. Aplicar filtros (espécie, idade, porte, localização)
3. Visualizar perfil do animal (fotos, histórico de saúde, ONG responsável)
4. Clicar **Estou Interessado** para notificar a ONG

### 🏢 ONG / Abrigo

1. Login na área administrativa
2. Selecionar **Cadastrar Novo Animal**
3. Preencher formulário (nome, espécie, idade, fotos, histórico)
4. Confirmar cadastro — animal aparece na vitrine

### 🚨 Denúncias

1. Acessar **Denunciar** (logado ou anônimo)
2. Preencher descrição e anexar evidências (fotos, vídeos, localização)
3. Enviar — sistema gera protocolo e encaminha para ONG/órgãos parceiros

---

## 🔧 Como Estender o Projeto (Sugestões de melhoria)

- Migrar para arquitetura de microserviços se a carga aumentar
- Usar S3 (ou similar) para armazenamento de mídia
- Implementar filas (RabbitMQ/Kafka) para tarefas assíncronas
- Isolar testes de integração e usar TestContainers para pipelines com PostgreSQL real

---

## 🧾 Exemplo de `Jenkinsfile` (simplificado)

```groovy
pipeline {
  agent any
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build Backend') { steps { sh 'mvn -B -DskipTests=false -Dspring.profiles.active=test -Dspring.flyway.enabled=false test' } }
    stage('Build Frontend') { steps { dir('adopetme-frontend') { sh 'npm ci && npm run build' } } }
    stage('Package') { steps { sh 'mvn -B package -DskipTests=true' } }
  }
  post { always { junit 'adopetme-monolitic-backend/target/surefire-reports/*.xml' } }
}
```

---

## 📬 Contato e Próximos Passos

- Abra issues com rótulos `enhancement` ou `bug` para contribuições
- Próximo passo recomendado: criar `src/test/resources/application-test.properties` com configuração H2 e adicionar `@ActiveProfiles("test")` nas classes de integração

---

### 🏫 Sobre

06P - Universidade Presbiteriana Mackenzie — Projeto: Laboratório de Engenharia de Software


## Sobre o projeto
O **Adopet.me** é um sistema de adoção de animais domésticos que conecta pessoas interessadas em adotar a ONGs de proteção animal. A plataforma funciona como uma vitrine digital, permitindo localizar ONGs próximas, visualizar os animais disponíveis e agendar visitas conforme a disponibilidade da organização.

---

## Tecnologias utilizadas
### **Frontend**
- React.js  

### **Backend**
- Java Spring Boot (API RESTful)  
- Spring Security + JWT (Autenticação e Autorização)  
- Maven (Gerenciamento de dependências)  
- JSON (Transporte de pacotes)  

### **Banco de Dados**
- PostgreSQL  
- MongoDB  
- SQL  

### **DevOps & Infraestrutura**
- Docker (Ambiente de desenvolvimento)  
- Jenkins (Gerenciamento de CI/CD)  
- Kubernetes (Deploy e orquestração de containers)  
- AWS (Hospedagem em nuvem)  

### **Testes** 
- JUnit (Testes unitários)  

---
