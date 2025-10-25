# Frete Já – Sistema de Cotação de Fretes

Aplicação web desenvolvida para a disciplina **Desenvolvimento Web III**, com objetivo de permitir cotações de frete entre empresas demandantes e transportadoras.

## 👥 Equipe
- **Giovanni**
- **Gustavo Henrique**
- **Igor**
- **Michael**

## 🏗️ Tecnologias
- **Backend:** Java 21, Spring Boot (Web, Security, Data MongoDB)
- **Frontend:** TBD
- **Banco de Dados:** MongoDB
- **Infra:** Docker + Docker Compose
- **Segurança:** JWT (HS256/HS512), BCrypt, HTTPS *(proxy/Nginx em produção)*
- **DevOps:** GitHub, Maven, Swagger/OpenAPI
---

## ⚙️ Como acessar o projeto

### Docker Compose (api + mongo)
1. **Digite no terminal**
   ```bash
   docker compose down
   docker compose up -d --build
   docker compose ps
   docker compose logs -f api
   ```
2. **Busque no Google**
   ```
   localhost:8080
   ```
---

## 🌿 Fluxo de Branches

- `main` → versão estável (entregas finais)  
- `sprint-x` → versão a cada sprint  

Mudar de Branch:
```bash
git checkout sprint-x
```

## 🔄 Contribuindo
 
1. Commitar mudanças com mensagens claras
2. Push para a branch `sprint-x`

---

## 🛠️ Troubleshooting (concertar error)

- **Porta 8080 ocupada**: troque `SERVER_PORT` no `.env` (ex.: `8082`) ou finalize o processo.
- **Erro 403**: em andamento.

---

## 🧭 Visão Geral (estado atual do backend)

Arquitetura Control-Service-Repository:

- Autenticação **JWT** com `JwtAuthFilter`.
- Autorização por **perfis**: `ADMIN`, `DEMANDANTE`, `TRANSPORTADORA`.
- **DTOs** e **validações** (Bean Validation) nos controllers.
- **Tratamento de erros** padronizado via `@ControllerAdvice`.
- **Validação de CEP** (formato; client ViaCEP opcional com fallback).
- **Seeds** (usuários) e **índice TTL** para histórico.
- **CORS** configurável por ambiente.
- **Docker/Compose** para `api` + `mongo` (+ opcional `mongo-express`).
- **Swagger/OpenAPI** pronto para ativar.

---

## 🔐 Autenticação, Perfis e Seeds

**Seeds**:

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

---
