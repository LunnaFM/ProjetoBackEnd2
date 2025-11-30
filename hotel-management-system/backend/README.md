# Backend - Sistema de Gerenciamento de Hotel

API RESTful desenvolvida com Node.js, Express e PostgreSQL para gerenciar clientes, quartos e reservas de um hotel.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **dotenv** - Variáveis de ambiente
- **CORS** - Controle de acesso

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

## 🔧 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar PostgreSQL

Crie um banco de dados no PostgreSQL:

```sql
CREATE DATABASE hotel_db;
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_db
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=seu_secret_super_seguro
JWT_EXPIRES_IN=7d
```

### 4. Iniciar o servidor

**Modo desenvolvimento (com nodemon):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação

#### Registrar usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

#### Obter dados do usuário logado
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Clientes

#### Listar todos os clientes
```http
GET /api/clientes
Authorization: Bearer {token}
```

#### Buscar cliente por ID
```http
GET /api/clientes/:id
Authorization: Bearer {token}
```

#### Criar cliente
```http
POST /api/clientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Maria Santos",
  "cpf": "123.456.789-00",
  "email": "maria@email.com",
  "telefone": "(43) 99999-9999",
  "endereco": "Rua ABC, 123",
  "dataNascimento": "1990-05-15"
}
```

#### Atualizar cliente
```http
PUT /api/clientes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Maria Santos Silva",
  "telefone": "(43) 98888-8888"
}
```

#### Excluir cliente
```http
DELETE /api/clientes/:id
Authorization: Bearer {token}
```

### Quartos

#### Listar todos os quartos
```http
GET /api/quartos
Authorization: Bearer {token}

# Filtros opcionais:
GET /api/quartos?status=disponivel
GET /api/quartos?tipo=suite
```

#### Listar quartos disponíveis
```http
GET /api/quartos/disponiveis
Authorization: Bearer {token}
```

#### Buscar quarto por ID
```http
GET /api/quartos/:id
Authorization: Bearer {token}
```

#### Criar quarto
```http
POST /api/quartos
Authorization: Bearer {token}
Content-Type: application/json

{
  "numero": "101",
  "tipo": "suite",
  "capacidade": 2,
  "valorDiaria": 250.00,
  "status": "disponivel",
  "descricao": "Suite luxo com vista para o mar"
}
```

#### Atualizar quarto
```http
PUT /api/quartos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "valorDiaria": 280.00,
  "status": "manutencao"
}
```

#### Excluir quarto
```http
DELETE /api/quartos/:id
Authorization: Bearer {token}
```

### Reservas

#### Listar todas as reservas
```http
GET /api/reservas
Authorization: Bearer {token}

# Filtro opcional:
GET /api/reservas?status=confirmada
```

#### Buscar reserva por ID
```http
GET /api/reservas/:id
Authorization: Bearer {token}
```

#### Criar reserva
```http
POST /api/reservas
Authorization: Bearer {token}
Content-Type: application/json

{
  "clienteId": 1,
  "quartoId": 1,
  "dataCheckIn": "2024-12-10",
  "dataCheckOut": "2024-12-15",
  "observacoes": "Cliente VIP"
}
```
*Nota: numeroDias e valorTotal são calculados automaticamente*

#### Atualizar reserva
```http
PUT /api/reservas/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "dataCheckOut": "2024-12-16",
  "status": "confirmada"
}
```

#### Cancelar reserva
```http
PATCH /api/reservas/:id/cancelar
Authorization: Bearer {token}
```

#### Excluir reserva
```http
DELETE /api/reservas/:id
Authorization: Bearer {token}
```

## 🗂️ Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do Sequelize
│   ├── controllers/
│   │   ├── authController.js    # Controlador de autenticação
│   │   ├── clienteController.js # Controlador de clientes
│   │   ├── quartoController.js  # Controlador de quartos
│   │   └── reservaController.js # Controlador de reservas
│   ├── middlewares/
│   │   └── auth.js              # Middleware de autenticação JWT
│   ├── models/
│   │   ├── User.js              # Model de usuário
│   │   ├── Cliente.js           # Model de cliente
│   │   ├── Quarto.js            # Model de quarto
│   │   ├── Reserva.js           # Model de reserva
│   │   └── index.js             # Relacionamentos e sync
│   └── routes/
│       ├── authRoutes.js        # Rotas de autenticação
│       ├── clienteRoutes.js     # Rotas de clientes
│       ├── quartoRoutes.js      # Rotas de quartos
│       ├── reservaRoutes.js     # Rotas de reservas
│       └── index.js             # Centralizador de rotas
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
├── server.js                    # Arquivo principal
└── README.md
```

## 🔐 Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. Após o login, você receberá um token que deve ser enviado no header de todas as requisições protegidas:

```
Authorization: Bearer seu_token_aqui
```

## ✅ Validações

### Cliente
- Nome: 3-100 caracteres
- CPF: Formato 000.000.000-00 (único)
- Email: Formato válido
- Telefone: Obrigatório

### Quarto
- Número: Único
- Tipo: solteiro, casal, luxo ou suite
- Capacidade: 1-10 pessoas
- Valor diária: Maior que zero
- Status: disponivel, ocupado ou manutencao

### Reserva
- Data check-out deve ser posterior ao check-in
- Verifica conflitos de reservas (mesmo quarto no mesmo período)
- Cálculo automático de dias e valor total

## 🧪 Testando a API

Recomenda-se usar **Insomnia** ou **Postman** para testar os endpoints.

### Fluxo de teste básico:

1. Registrar um usuário (`POST /api/auth/register`)
2. Fazer login (`POST /api/auth/login`) - copiar o token
3. Criar um cliente (`POST /api/clientes`)
4. Criar um quarto (`POST /api/quartos`)
5. Criar uma reserva (`POST /api/reservas`)

## 📝 Observações

- O campo `senha` nunca é retornado nas respostas da API
- Ao excluir um cliente ou quarto, suas reservas também são excluídas (CASCADE)
- As datas devem estar no formato `YYYY-MM-DD`
- O valor da diária deve ser um número decimal (ex: 250.00)

## 👨‍💻 Desenvolvimento

**Autor:** Projeto 2 - Programação Web Back-End  
**Instituição:** UTFPR - Campus Cornélio Procópio  
**Disciplina:** Programação Web Back-End
