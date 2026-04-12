# Biblioteca Mahal

Aplicação desktop/web da Biblioteca Mahal, com suporte a ambiente local para desenvolvimento e geração de build.

---

## 🚀 Requisitos

Antes de começar, tenha instalado:

### 🐳 Opção 1 — Docker
- Docker
- Docker Compose

### ⚙️ Opção 2 — npm
- Node.js
- npm

---

## 📦 Instalação do projeto

Clone o repositório:

```bash
git clone https://github.com/SrMahal/biblioteca-mahal.git
cd biblioteca-mahal
```

---

## ⚙️ Configuração de ambiente

Este projeto utiliza variáveis de ambiente.

Crie um arquivo `.env` com base no arquivo de exemplo:

### Linux / Mac
```bash
cp .env.example .env
```

### Windows (PowerShell)
```powershell
copy .env.example .env
```

Depois, ajuste os valores conforme seu ambiente.

---

## 🐳 Opção 1 — Rodar com Docker Compose

Recomendado para subir todo o ambiente padronizado.

### ▶️ Subir os containers
```bash
docker compose up -d --build
```

### ⏹️ Parar os containers
```bash
docker compose down
```

### 📄 Ver logs
```bash
docker compose logs -f
```

### 🔄 Rebuild completo
```bash
docker compose down
docker compose up -d --build
```

---

## ⚙️ Opção 2 — Rodar com npm

Recomendado para desenvolvimento local ou build manual.

### 📥 Instalar dependências
```bash
npm install
```

> Isso instalará automaticamente dependências como Electron e electron-builder definidas no `package.json`.

---

### ▶️ Rodar em modo desenvolvimento
```bash
npm start
```

---

### 🏗️ Gerar build
```bash
npm run dist
```

---

## 📁 Estrutura básica do projeto

```bash
biblioteca-app/
├── build/
├── dist/
├── php/
├── www/
├── main.js
├── package.json
├── package-lock.json
├── docker-compose.yml
├── Dockerfile
├── site.conf
└── .env.example
```

---

## ⚠️ Observações importantes

- O arquivo `.env` **não é versionado**
- Sempre use `.env.example` como base
- O diretório `dist/` contém arquivos gerados (build)
- O diretório `node_modules/` não é incluído no Git

---

## 🧠 Fluxo recomendado para DEV

### 🐳 Usando Docker
1. Clonar o projeto  
2. Criar `.env`  
3. Rodar:
```bash
docker compose up -d --build
```

---

### ⚙️ Usando npm
1. Clonar o projeto  
2. Criar `.env`  
3. Rodar:
```bash
npm install
npm start
```

Ou para build:

```bash
npm run dist
```

---

## 🤝 Contribuição

```bash
git checkout -b minha-feature
git add .
git commit -m "feat: minha feature"
git push origin minha-feature
```

---

## 📄 Licença

Definir futuramente.
