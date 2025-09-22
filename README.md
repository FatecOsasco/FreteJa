# Frete Já – Sistema de Cotação de Fretes

Aplicação web desenvolvida para a disciplina **Desenvolvimento Web III**, com objetivo de permitir cotações de frete entre empresas demandantes e transportadoras.

---

## 👥 Equipe
- Giovanni Carneiro Nunes
- Gustavo Henrique Barbosa Almeida
- Igor Alves Baptistella
- Michael Teixeira da Costa

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

## Para parar o container:
docker-compose down


## 🌿 Fluxo de Branches
main → versão estável (entregas finais)
develop → integração das features
feature/* → novas funcionalidades
hotfix/* → correções rápidas

Exemplo de criação de branch:
git checkout -b feature/cadastro-usuario

## 🔄 Contribuindo
Criar uma branch para sua tarefa.
Commitar mudanças.
Abrir um Pull Request (PR) para develop.
Outro colega revisa e aprova.
Quando estável, merge para main.
