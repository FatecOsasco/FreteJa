# Frete Já – Sistema de Cotação de Fretes

Aplicação web desenvolvida para a disciplina **Desenvolvimento Web III**, com objetivo de permitir cotações de frete entre empresas demandantes e transportadoras.

## 👥 Equipe
- **Giovanni**
- **Gustavo Henrique**
- **Igor**
- **Michael**

## 🏗️ Tecnologias
- **Backend:** Java 21, Spring Boot (Web, Security, Data MongoDB)
- **Frontend:** React
- **Banco de Dados:** MongoDB
- **Infra:** Docker + Docker Compose
- **Segurança:** JWT (HS256/HS512), BCrypt, HTTPS *(proxy/Nginx em produção)*
- **DevOps:** GitHub, Maven, Swagger/OpenAPI
---

## Como acessar o projeto

### Docker Compose (api + mongo)
1. **Digite no terminal**
   ```bash
   docker compose down
   docker compose up -d --build
   ```
2. **Busque no Google**
   ```
   http://localhost:5173
   ```
---

## Visão Geral

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
