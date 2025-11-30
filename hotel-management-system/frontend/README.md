# Frontend - Sistema de Gerenciamento de Hotel

Interface web desenvolvida com React para gerenciar clientes, quartos e reservas de um hotel.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript
- **Vite** - Build tool e dev server
- **React Router DOM** - Navegação entre páginas
- **Axios** - Cliente HTTP para consumir a API
- **CSS Modules** - Estilização componentizada

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Backend rodando em `http://localhost:3000`

## 🔧 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 3. Build para produção

```bash
npm run build
```

## 📱 Páginas da Aplicação

### Públicas
- `/login` - Página de login
- `/register` - Página de registro

### Protegidas
- `/dashboard` - Dashboard com estatísticas
- `/clientes` - Gerenciamento de clientes
- `/quartos` - Gerenciamento de quartos
- `/reservas` - Gerenciamento de reservas

## 🗂️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── contexts/            # Contexts React
│   ├── pages/               # Páginas da aplicação
│   ├── services/            # Serviços de API
│   └── App.jsx              # Rotas principais
└── package.json
```

## 👨‍💻 Autor

Projeto acadêmico - UTFPR Cornélio Procópio
