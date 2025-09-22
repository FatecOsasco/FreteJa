# Frete Já – Sistema de Cotação de Fretes

Aplicação web desenvolvida para a disciplina **Desenvolvimento Web III**, com objetivo de permitir cotações de frete entre empresas demandantes e transportadoras.

---

## 👥 Equipe
- Giovanni Carneiro Nunes
- Gustavo Henrique Barbosa Almeida
- Igor Alves Baptistella
- Michael Teixeira da Costa – Banco de Dados

---

## 🏗️ Tecnologias
- **Backend:** Java 21 + Spring Boot (Web, Security, Data MongoDB)
- **Frontend:** Thymeleaf + Tailwind
- **Banco de Dados:** MongoDB
- **Infra:** Docker + Docker Compose
- **Segurança:** JWT, BCrypt, HTTPS
- **DevOps:** GitHub, Maven, Swagger/OpenAPI

---

## ⚙️ Para desenvolver o projeto:
Durante o desenvolvimento, apenas o **MongoDB roda no Docker**, e a aplicação roda direto no editor (Eclipse).  
Isso facilita o desenvolvimento, sem precisar reconstruir containers a cada mudança.

## Clonar o repositório no terminal
git clone https://github.com/freteja/freteja.git
cd freteja

## Subir somente o MongoDB
docker-compose up mongo

## Em outro terminal, rodar a aplicação localmente
mvn spring-boot:run

A aplicação ficará disponível na porta 8080 (localhost:8080).
