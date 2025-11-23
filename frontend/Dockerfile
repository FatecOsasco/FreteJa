FROM node:20-alpine

WORKDIR /app

# Copia apenas o package.json para instalar as dependências
COPY package.json ./

RUN npm install

# Agora copia o restante do código
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
