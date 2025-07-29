# B4You - Sistema de Produtos

Sistema de gerenciamento de produtos desenvolvido como teste técnico para a B4You, implementando um CRUD completo com autenticação JWT.

[![CI/CD Pipeline](https://github.com/migueldefrias/FullstackApplicationProject/actions/workflows/ci.yml/badge.svg)](https://github.com/migueldefrias/FullstackApplicationProject/actions/workflows/ci.yml)

## Tecnologias Utilizadas

### Backend
- **Node.js** com **Express**
- **MySQL** como banco de dados
- **Sequelize** como ORM
- **JWT** para autenticação
- **Yup** para validação
- **ESLint** para linting
- **Docker & Docker Compose** para containerização

### Frontend
- **Next.js 15** (React)
- **TypeScript**
- **Tailwind CSS** para estilização
- **Axios** para requisições HTTP
- **ESLint** para linting

### CI/CD
- **GitHub Actions** para automação
- **Lint automático** no backend e frontend
- **Build automático** em múltiplas versões do Node.js
- **Testes de Docker** para verificar containerização

## Funcionalidades

- Autenticação com JWT
- CRUD completo de produtos
- Interface responsiva
- Validação de formulários
- Mensagens de loading e erro
- Proteção de rotas
- Containerização com Docker

## Configuração e Instalação

### Pré-requisitos
- Node.js (v18 ou superior)
- Docker e Docker Compose
- Git

### 1. Abra o repositório


### 2. Configure as variáveis de ambiente

#### Backend
Copie o arquivo de exemplo e configure:
```bash
cp backend/.env.example backend/.env
```

Conteúdo do `backend/.env`:
```env
# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=b4you
DB_USER=root
DB_PASSWORD=root123

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=3001
NODE_ENV=development
```

#### Frontend
Copie o arquivo de exemplo:
```bash
cp frontend/.env.example frontend/.env.local
```

Conteúdo do `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Executar com Docker

```bash
# Subir todos os serviços
docker-compose up -d

# Aguardar a inicialização e executar as migrações
sleep 10
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

### 4. Executar sem Docker (Alternativo)

#### Backend
```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Acessar a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Credenciais de Acesso

Para fazer login no sistema, use as seguintes credenciais:

- **E-mail**: `admin@b4you.dev`
- **Senha**: `123456`

## Endpoints da API

### Autenticação
- `POST /auth/login` - Login do usuário

### Produtos (requer autenticação)
- `GET /products` - Listar todos os produtos
- `GET /products/:id` - Obter produto específico
- `POST /products` - Criar novo produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Excluir produto

### Exemplo de requisição para criar produto:
```json
{
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "price": 29.99,
  "stock": 100
}
```

## Estrutura do Projeto

```
B4YOU/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores das rotas
│   │   ├── database/        # Configuração do banco
│   │   ├── middlewares/     # Middlewares (auth, etc.)
│   │   ├── models/          # Modelos Sequelize
│   │   ├── routes/          # Definição das rotas
│   │   └── server.js        # Servidor principal
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/             # Páginas Next.js 13+ (App Router)
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # Context API (Auth)
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilitários (API config)
│   ├── public/              # Arquivos estáticos
│   ├── package.json
│   └── .env.example
├── mysql-data/              # Dados persistentes do MySQL
├── docker-compose.yml
└── README.md
```

## Funcionalidades do Frontend

### Páginas
- **/** - Redirecionamento automático
- **/login** - Página de autenticação
- **/products** - Lista de produtos
- **/products/new** - Criar novo produto
- **/products/[id]** - Visualizar produto
- **/products/[id]/edit** - Editar produto

### Recursos
- Interface com Tailwind CSS
- Estados de loading em todas as operações
- Tratamento de erros com mensagens amigáveis
- Interceptors do Axios para autenticação automática
- Redirecionamento automático em caso de token expirado
- Validação de formulários no client-side

## Segurança

- Autenticação JWT com expiração de 1 hora
- Validação de dados no backend com Yup
- Middleware de autenticação para rotas protegidas
- Headers de CORS configurados
- Interceptors para tratamento automático de tokens expirados
---
