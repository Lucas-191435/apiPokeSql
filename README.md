# 🐾 API Pokémon

Uma API REST completa para gerenciamento de informações de Pokémon e usuários, desenvolvida com Node.js, TypeScript, Express e Prisma ORM.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Express** - Framework web para Node.js
- **Prisma** - ORM para banco de dados
- **MySQL** - Sistema de gerenciamento de banco de dados
- **JWT** - Autenticação por tokens
- **Bcrypt** - Hash de senhas
- **Multer** - Upload de arquivos
- **Axios** - Cliente HTTP para integração com APIs externas
- **AWS SES** - Serviço de e-mail
- **Yup** - Validação de schemas

## 📁 Estrutura do Projeto

```
├── src/
│   ├── app.ts                 # Configuração principal da aplicação
│   ├── server.ts              # Servidor HTTP
│   ├── config/                # Configurações (auth, multer, etc.)
│   ├── database/              # Configuração do banco de dados
│   ├── interfaces/            # Definições de tipos TypeScript
│   ├── middlewares/           # Middlewares de autenticação e validação
│   ├── modules/               # Módulos da aplicação
│   │   ├── pokemon/           # Funcionalidades relacionadas aos Pokémon
│   │   └── user/              # Funcionalidades relacionadas aos usuários
│   ├── routes/                # Rotas da API
│   ├── services/              # Serviços externos
│   ├── types/                 # Tipos TypeScript
│   └── utils/                 # Utilitários e helpers
├── prisma/                    # Configuração e migrações do Prisma
├── tmp/                       # Arquivos temporários (avatares)
└── Dockerfile                 # Configuração para containerização
```

## ✨ Funcionalidades

### 👤 Gerenciamento de Usuários
- ✅ Registro de usuários com upload de avatar
- ✅ Autenticação via JWT
- ✅ Login e logout
- ✅ Atualização de perfil
- ✅ Sistema de reset de senha via e-mail
- ✅ Exclusão de conta

### 🐾 Gerenciamento de Pokémon
- ✅ Listagem de Pokémon com filtros (página, busca, tipos, peso)
- ✅ Detalhes de Pokémon específico
- ✅ Inserção de dados de Pokémon no banco
- ✅ Integração com PokeAPI externa
- ✅ Suporte a diferentes regiões (Kanto, Johto, Hoenn, Sinnoh, Unova)

### 🔐 Segurança
- ✅ Autenticação obrigatória para endpoints protegidos
- ✅ Validação de requisições
- ✅ Hash de senhas com Bcrypt
- ✅ Tokens JWT para sessões

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MySQL
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd apiPokeSQL
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
# Banco de dados
DATABASE_URL="mysql://usuario:senha@localhost:3306/pokemon_db"

# Aplicação
APP_URL="http://localhost:3001"
PORT=3001

# JWT
JWT_SECRET="seu-jwt-secret-aqui"

# AWS SES (para envio de e-mails)
AWS_ACCESS_KEY_ID="sua-access-key"
AWS_SECRET_ACCESS_KEY="sua-secret-key"
AWS_REGION="sa-east-1"

# E-mail
EMAIL_FROM="seuemail@exemplo.com"
```

### 4. Configure o banco de dados
```bash
# Gere o cliente Prisma
npx prisma generate

# Execute as migrações
npx prisma migrate dev

# (Opcional) Visualize o banco com Prisma Studio
npx prisma studio
```

### 5. Execute a aplicação

#### Desenvolvimento
```bash
npm run dev
```

#### Produção
```bash
npm run build
npm start
```

A API estará disponível em `http://localhost:3001`

## 📚 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/user` | Criar usuário | ❌ |
| POST | `/auth/login` | Login | ❌ |
| POST | `/auth/resetPassword` | Solicitar reset de senha | ❌ |
| POST | `/auth/validateTokenForResetPassword` | Validar token de reset | ❌ |

### Usuários
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/user/:userId` | Obter dados do usuário | ✅ |
| PUT | `/user/:userId` | Atualizar usuário | ✅ |
| DELETE | `/user/:userId` | Excluir usuário | ✅ |

### Pokémon
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/pokemon` | Listar Pokémon | ✅ |
| GET | `/pokemon/:id` | Obter Pokémon específico | ✅ |
| GET | `/insertPokemonInDataBase` | Inserir Pokémon no banco | ✅ |

#### Parâmetros de consulta para `/pokemon`:
- `page`: Número da página (padrão: 1)
- `pageSize`: Itens por página (padrão: 20)
- `query`: Busca por nome
- `types`: Filtro por tipos
- `weight`: Filtro por peso

## 🐳 Docker

O projeto inclui um Dockerfile para containerização:

```bash
# Construir a imagem
docker build -t pokemon-api .

# Executar o container
docker run -p 3001:3001 pokemon-api
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Schema do Banco de Dados

### User
- `id`: UUID único
- `email`: E-mail único do usuário
- `password`: Senha hashada
- `name`: Nome do usuário
- `avatar`: URL do avatar
- `role`: Papel (ADMIN/CLIENT)
- `birthday`: Data de nascimento
- Campos para OAuth e reset de senha

### Pokemon
- `id`: UUID único
- `pokeId`: ID único do Pokémon
- `name`: Nome do Pokémon
- `img1`, `img2`, `img3`: URLs das imagens
- `types`: Tipos do Pokémon
- `abilities`: Habilidades
- `height`: Altura
- `weight`: Peso
- `region`: Região (KANTO, JOHTO, HOENN, SINNOH, UNOVA)

## 🚩 Status do Projeto

🟢 **Ativo** - Em desenvolvimento contínuo

## 📄 Licença

Este projeto está sob a licença ISC - veja o arquivo [LICENSE](LICENSE) para detalhes.