**Nome do Projeto**

Adopet.me

**Integrantes do Grupo**

- **Matheus de Andrade Lourenço**: 10419691
- **Murillo Cardoso Ferreira**: 10418082
- **Pietro Zanaga Neto**: 10418574

**Detalhes do Projeto**

- **Contexto de Negócio**: O projeto Adopet.me é uma plataforma digital para centralizar, formalizar e facilitar o processo de adoção de animais. Hoje faltam canais centralizados que deem visibilidade às ONGs e abrigos, resultando em superlotação e dificuldade na conexão entre adotantes e instituições. A proposta é oferecer uma "vitrine" digital que permita buscas por localização e características do animal, suporte administrativo para ONGs e um canal de denúncias para abandono/maus-tratos.
- **Público-alvo**: pessoas interessadas em adoção, ONGs/abrigo, voluntários e órgãos parceiros.
- **Objetivos**:
  - Aumentar visibilidade de animais e ONGs.
  - Tornar adoções mais seguras, transparentes e acessíveis.
  - Reduzir superlotação dos abrigos.
  - Criar canal de denúncias com protocolo e acompanhamento.

**Requisitos Principais (resumo)**
- Cadastro e autenticação de usuários e ONGs.
- Cadastro/atualização de animais com fotos e histórico.
- Busca por filtros (espécie, idade, porte, localização).
- Área administrativa para ONGs.
- Canal de denúncias (descrição, fotos, vídeos, localização).
- Notificações e acompanhamento de status.

**Documentação**

**Arquitetura Geral**
- **Monorepo dividido em dois módulos principais**: frontend (`adopetme-frontend`) e backend (`adopetme-monolitic-backend`). A integração ocorre via APIs REST/JSON.
- **Camadas**: UI (React + Vite), API (Spring Boot), Persistência (PostgreSQL em produção, H2 em testes), Infra (Docker + docker-compose) e CI (Jenkins).

**Frontend**
- Local: `adopetme-frontend`
- **Tecnologias**: React + TypeScript + Vite.
- **Responsabilidades**: experiência do usuário, rotas públicas/privadas, consumo das APIs do backend, upload de imagens, gerenciamento de sessões (OAuth2 / JWT quando aplicável).

**Backend**
- Local: `adopetme-monolitic-backend`
- **Tecnologias**: Java 17, Spring Boot, Spring Data JPA, Flyway (migrations), JWT (autenticação), JUnit 5 + Mockito (testes).
- **Responsabilidades**: expondo endpoints REST para autenticação, gerenciamento de usuários/ONGs/animais, processamento de denúncias, regras de negócio e integração com banco e serviços externos.

**Banco de Dados**
- **Produção**: PostgreSQL (migrations em `src/main/resources/db/migration` via Flyway).
- **Testes/Local**: H2 em memória (recomendado para testes automatizados e CI). Nos testes configure o profile `test` ou use propriedades de ambiente para apontar para `jdbc:h2:mem:testdb` e desabilitar Flyway.

**Docker**
- Arquivos: `docker-compose.yml` e `docker-compose.dev.yml` na raiz.
- Função: orquestra frontend, backend e banco para execução local ou em ambientes de teste. Use `docker-compose up --build` para subir o ambiente completo.

**Jenkins / CI**
- Estratégia recomendada:
  - Job que executa: `checkout`, `mvn -B -DskipTests=false test`, `npm ci && npm run build` (frontend), `mvn -B -Djacoco:report` (opcional cobertura).
  - Para evitar dependência de PostgreSQL no CI, adicionar um profile `test` que usa H2 e desabilita Flyway, ou passar propriedades JVM durante o `mvn test`:

```
mvn -B -Dspring.profiles.active=test -Dspring.flyway.enabled=false test
```

**Testes**
- Frameworks: JUnit 5, Mockito, Spring Boot Test para testes que precisam do contexto.
- Boas práticas: preferir testes unitários sem `@SpringBootTest` quando possível; para testes que iniciam contexto usar `application-test.properties` com H2.

**Manual de Instalação**

Requisitos gerais:
- Java 17 (OpenJDK 17)
- Maven 3.6+
- Node.js 16+ & npm/Yarn
- Docker & docker-compose (opcional para ambiente conteinerizado)

Linux / WSL (Debian/Ubuntu)

```
# instalar Java 17
sudo apt update && sudo apt install -y openjdk-17-jdk

# instalar Maven
sudo apt install -y maven

# instalar Node.js (exemplo via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# instalar Docker
sudo apt-get install -y docker.io docker-compose

# rodar frontend (modo local)
cd adopetme-frontend
npm ci
npm run dev

# rodar backend (modo local)
cd ../adopetme-monolitic-backend
# usar mvnw se disponível: ./mvnw spring-boot:run
mvn spring-boot:run
```

macOS (Homebrew)

```
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

Windows (PowerShell / WSL recomendado)
- Recomendado usar WSL2 (Ubuntu) para evitar incompatibilidades com ferramentas Unix.
- Alternativamente instalar Java 17, Maven e Node via pacotes oficiais e executar comandos análogos aos acima.

**Executando com Docker (recomendado para demo/local)**

```
# na raiz do repo
docker-compose -f docker-compose.dev.yml up --build
```

Isso criará os serviços (frontend, backend, DB) configurados no `docker-compose.dev.yml`.

**Executando Testes Localmente**
- Preferir o profile de teste (H2). Exemplo:

```
# com wrapper (se permissões corretas)
./mvnw -Dspring.profiles.active=test -Dspring.flyway.enabled=false test

# ou usando mvn e definindo JAVA_HOME explicitamente
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn -Dspring.profiles.active=test -Dspring.flyway.enabled=false test
```

Nota: em alguns ambientes a pasta `~/.m2` pode exigir permissões; para CI/containers é comum usar um repositório local dentro do workspace:

```
mvn -Dmaven.repo.local=$PWD/.m2/repository test
```

**Manual de Utilização (fluxos principais)**

- Usuário buscador:
  - Entrar em `Buscar Animais` → aplicar filtros → visualizar perfil do animal → clicar `Estou Interessado` para notificar a ONG.

- ONG / Abrigo:
  - Login na área administrativa → `Cadastrar Novo Animal` → preencher formulário (fotos e histórico) → confirmar.

- Canal de denúncias:
  - Acessar `Denunciar` (logado ou anônimo) → submeter descrição/evidências → receber protocolo e acompanhamento.

**Como Estender o Projeto (dicas de desenvolvimento)**
- Adicionar microserviços se o sistema crescer: separar serviços de autenticação, gerenciamento de mídias, e buscas.
- Substituir storage local por S3 (ou equivalente) para fotos e arquivos grandes.
- Implementar notificações via fila (RabbitMQ/Kafka) para processos assíncronos (confirmação de adoção, envio de protocolo).
- Adotar testes de integração separados da suíte unitária e usar containers (TestContainers) nos pipelines CI para testar com PostgreSQL real quando necessário.

**Sugestão de Jenkinsfile (exemplo simplificado)**

```
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

**Contato / Próximos Passos**
- Para dúvidas ou contribuições, abrir uma issue neste repositório com o rótulo `enhancement` ou `bug`.
- Próximo passo sugerido: criar `src/test/resources/application-test.properties` com configuração H2 e adicionar `@ActiveProfiles("test")` nos testes de integração para estabilizar CI.

---

Obrigado por colaborar com o Adopet.me — contribuições são bem-vindas! Sinta-se à vontade para pedir que eu também faça o commit e o push desse README para `origin/main`, ou que eu gere o `application-test.properties` e um `Jenkinsfile` real na raiz.
# Sistema-Adopet_Me
06P - Universidade Presbiteriana Mackenzie - Projeto Laboratório de Engenharia de Software  

---

### Grupo:
- Luis Felipe Basacchi Darre  
- Danilo Yui Honda  
- Matheus de Andrade Lourenço  
- Murillo Cardoso Ferreira  
- Pietro Zanaga Neto  

---

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
