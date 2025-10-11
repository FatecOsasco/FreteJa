# Frete Já – Sistema de Cotação de Fretes

Aplicação web desenvolvida para a disciplina **Desenvolvimento Web III**, com objetivo de permitir cotações de frete entre empresas demandantes e transportadoras.

## 👥 Equipe
- **Giovanni Carneiro Nunes**
- **Gustavo Henrique Barbosa Almeida**
- **Igor Alves Baptistella**
- **Michael Teixeira da Costa**

## 🏗️ Tecnologias
- **Backend:** Java 21, Spring Boot (Web, Security, Data MongoDB)
- **Frontend:** TBD
- **Banco de Dados:** MongoDB 6
- **Infra:** Docker + Docker Compose
- **Segurança:** JWT (HS256/HS512), BCrypt, HTTPS *(via proxy/Nginx em produção)*
- **DevOps:** GitHub, Maven, Swagger/OpenAPI

---

## ⚙️ Como desenvolver o projeto

### Opção A — Fluxo de DEV (Mongo no Docker, app no Maven)
Durante o desenvolvimento, apenas o **MongoDB** roda no Docker e a aplicação roda via Maven.  
Evita rebuild de imagem a cada mudança.

1. **Clonar**
   ```bash
   git clone https://github.com/freteja/freteja.git
   cd freteja
   ```
2. **Subir somente o Mongo**
   ```bash
   docker compose up -d mongo
   ```
3. **Exportar variáveis**
   ```bash
   export MONGODB_URI="mongodb://localhost:27017/freteja"
   export JWT_SECRET="<chave do projeto - pedir pro Giovanni>"
   export CORS_ALLOWED_ORIGINS="http://localhost"
   ```
4. **Rodar a aplicação**
   ```
   bashmvn spring-boot:run -Dspring-boot.run.arguments="--server.port=0" 
   ```
5. **Parar o Mongo**
   ```bash
   docker compose down
   ```

### Opção B — Tudo com Docker Compose (api + mongo)
1. **.env** (na raiz):
   ```
   SERVER_PORT=8080
   MONGODB_URI=mongodb://mongo:27017/freteja
   CORS_ALLOWED_ORIGINS=http://localhost
   JWT_SECRET=<chave do projeto - pedir pro Giovanni>
   JWT_EXPIRATION_MS=86400000
   ```
2. **Subir**
   ```bash
   docker compose up -d --build
   docker compose ps
   docker compose logs -f api
   ```
3. **Acessos**
   - API: `http://localhost:8080`
   - Mongo Express (opcional): `http://localhost:8081`

---

## 🌿 Fluxo de Branches

- `main` → versão estável (entregas finais)  
- `develop` → integração das features  
- `feature/*` → novas funcionalidades  
- `hotfix/*` → correções rápidas  

Exemplo:
```bash
git checkout -b feature/cadastro-usuario
```

## 🔄 Contribuindo

1. Criar uma branch para sua tarefa.  
2. Commitar mudanças com mensagens claras.  
3. Abrir um Pull Request (PR) para `develop`.  
4. Revisão por outro membro da equipe.  
5. Quando estável, merge para `main`.

---

## 🛠️ Troubleshooting

- **Erro JWT curto (400)**: gere `JWT_SECRET` com **32+ caracteres** e reinicie.
- **Porta 8080 ocupada**: troque `SERVER_PORT` no `.env` (ex.: `8082`) ou finalize o processo.
- **`UnknownHost mongo` fora do Compose**: use `MONGODB_URI=mongodb://localhost:27017/freteja`.
- **CORS no navegador**: a origem do front deve ser **exatamente** a informada.
- **Seeds não aparecem**: os seeds rodam apenas se `users.count()==0`.  
  Para resemear, apague a coleção `users` e reinicie a aplicação.

---

## 🧭 Visão Geral (estado atual do backend)

- Autenticação **JWT** com `JwtAuthFilter`.
- Autorização por **perfis**: `ADMIN`, `DEMANDANTE`, `TRANSPORTADORA`.
- **DTOs** e **validações** (Bean Validation) nos controllers.
- **Tratamento de erros** padronizado via `@ControllerAdvice`.
- **Validação de CEP** (formato; client ViaCEP opcional com fallback).
- **Seeds** (usuários) e **índice TTL** para histórico.
- **CORS** configurável por ambiente.
- **Docker/Compose** para `api` + `mongo` (+ opcional `mongo-express`).
- **Swagger/OpenAPI** pronto para ativar.

**Estrutura essencial**
```
src/main/java/com/freteja/
  controller/    # AuthController, CotacaoController
  service/       # UserService, CotacaoService
  repository/    # UserRepository, CotacaoRepository, PropostaRepository
  security/      # JwtUtil, JwtAuthFilter, SecurityConfig
  model/         # User, Perfil, Cotacao, Proposta
  dto/           # LoginRequest, CotacaoCreateDTO, PropostaCreateDTO...
  advice/        # GlobalExceptionHandler
FreteJaApplication.java  # CommandLineRunner: índices + seeds
```

---

## 🔐 Autenticação, Perfis e Seeds

**Seeds** (criados se `users` estiver vazia):

| Perfil           | E-mail                       | Senha          |
|------------------|------------------------------|----------------|
| ADMIN            | `admin@freteja.com`          | `admin123`     |
| TRANSPORTADORA   | `transportador@freteja.com`  | `transport123` |
| DEMANDANTE       | `solicitante@freteja.com`    | `solicita123`  |

**Login**
```bash
curl -s -X POST http://localhost:8080/auth/login   -H 'Content-Type: application/json'   -d '{"email":"admin@freteja.com","senha":"admin123"}'
```
Resposta:
```json
{ "token": "<JWT>" }
```
Envie o token:
```
Authorization: Bearer <JWT>
```

**Perfis (resumo)**
- `DEMANDANTE`: cria cotações.
- `TRANSPORTADORA`: envia propostas.
- `ADMIN`: acesso amplo.

---

```
Rotas:
- UI: `http://localhost:8080/swagger-ui/index.html`
- Spec: `http://localhost:8080/v3/api-docs`

---

## 🧪 Exemplos de uso (curl)

### 1) Criar cotação (usuário DEMANDANTE)
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login   -H 'Content-Type: application/json'   -d '{"email":"solicitante@freteja.com","senha":"solicita123"}' | jq -r .token)

curl -s -X POST http://localhost:8080/cotacoes   -H "Authorization: Bearer $TOKEN"   -H 'Content-Type: application/json'   -d '{"origemCep":"04547000","destinoCep":"20040002","quantidade":1,"pesoKg":10,"dimensoes":"30x20x15"}'
```

### 2) Listar minhas cotações
```bash
curl -s http://localhost:8080/cotacoes   -H "Authorization: Bearer $TOKEN"
```

### 3) Adicionar proposta (usuário TRANSPORTADORA)
```bash
TOKEN_T=$(curl -s -X POST http://localhost:8080/auth/login   -H 'Content-Type: application/json'   -d '{"email":"transportador@freteja.com","senha":"transport123"}' | jq -r .token)

curl -s -X POST http://localhost:8080/cotacoes/<ID_DA_COTACAO>/propostas   -H "Authorization: Bearer $TOKEN_T"   -H 'Content-Type: application/json'   -d '{"valor":199.90,"prazoEntregaDias":"3","observacoes":"Retirada amanhã"}'
```

### 4) Aprovar / Reprovar
```bash
# Aprovar
curl -s -X POST "http://localhost:8080/cotacoes/<ID>/aprovar?propostaId=<ID_PROP>"   -H "Authorization: Bearer $TOKEN"

# Reprovar
curl -s -X POST "http://localhost:8080/cotacoes/<ID>/reprovar"   -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Testes & Build

- Build rápido:
  ```bash
  mvn -DskipTests clean package
  ```
- Rodar local (porta alternativa):
  ```bash
  SERVER_PORT=8082 MONGODB_URI="mongodb://localhost:27017/freteja"   JWT_SECRET="<já sabe rs>" CORS_ALLOWED_ORIGINS="http://localhost"   mvn -DskipTests spring-boot:run
  ```

> Observação: o seed roda no startup padrão. Para `mvn test` sem Mongo real, recomenda-se futuramente isolar com `@Profile("!test")` no `CommandLineRunner` ou `@ConditionalOnProperty`.

---
