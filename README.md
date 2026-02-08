# Brawl Lookup Pro - Node.js

## 📋 Descrição

Brawl Lookup Pro é uma aplicação web completa para consulta de dados do Brawl Stars, desenvolvida com Node.js, Express, TypeScript, React e tRPC.

## 🚀 Tecnologias

- **Backend**: Node.js 22+ com Express e TypeScript
- **Frontend**: React 19 com Vite e TypeScript
- **API**: tRPC para comunicação type-safe entre cliente e servidor
- **Banco de Dados**: MySQL com Drizzle ORM
- **Autenticação**: OAuth via Manus
- **Estilização**: TailwindCSS 4 com Radix UI
- **Gerenciador de Pacotes**: pnpm

## 📦 Instalação

### Pré-requisitos

- Node.js 22.x ou superior
- pnpm 10.x ou superior
- MySQL 8.x ou superior

### Passos

1. **Instalar dependências:**
```bash
pnpm install
```

2. **Configurar variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (veja `.env.example` para um template completo):

```env
# Brawl Stars API Token (obtenha em https://developer.brawlstars.com/)
BRAWL_TOKEN=seu_token_aqui

# Banco de dados MySQL
DATABASE_URL=mysql://usuario:senha@localhost:3306/brawl_lookup_pro

# OAuth Manus (opcional, para autenticação)
MANUS_OAUTH_CLIENT_ID=seu_client_id
MANUS_OAUTH_CLIENT_SECRET=seu_client_secret

# Porta do servidor (opcional, padrão: 3000)
PORT=3000
```

3. **Configurar banco de dados:**
```bash
pnpm db:push
```

## 🎯 Uso

### Modo Desenvolvimento

```bash
pnpm dev
```

O servidor será iniciado em `http://localhost:3000` (ou próxima porta disponível).

### Modo Produção

1. **Build:**
```bash
pnpm build
```

2. **Iniciar:**
```bash
pnpm start
```

## 🔧 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor em modo desenvolvimento com hot reload
- `pnpm build` - Compila o projeto para produção
- `pnpm start` - Inicia o servidor em modo produção
- `pnpm check` - Verifica tipos TypeScript sem compilar
- `pnpm format` - Formata o código com Prettier
- `pnpm test` - Executa os testes com Vitest
- `pnpm db:push` - Aplica as migrations do banco de dados

## 🌟 Funcionalidades

### API Brawl Stars

- ✅ Consulta de perfil de jogadores
- ✅ Consulta de clubes
- ✅ Histórico de batalhas
- ✅ Rankings globais e por país
- ✅ Rankings por Brawler
- ✅ Lista de Brawlers
- ✅ Eventos ativos
- ✅ Modos de jogo
- ✅ Ícones e assets
- ✅ **Novidades do Game** (baseado em eventos)
- ✅ **Temporadas do Game** (placeholder, aguardando API dedicada)

### Sistema de Favoritos

- ✅ Salvar jogadores e clubes favoritos
- ✅ Rastreamento de troféus
- ✅ Notificações de marcos (milestones)
- ✅ Histórico de snapshots de troféus

### Autenticação

- ✅ Login via OAuth (Manus)
- ✅ Gestão de sessões
- ✅ Proteção de rotas

### Cache

- ✅ Cache inteligente para reduzir chamadas à API
- ✅ TTL diferenciado por tipo de dado:
  - 1 minuto: dados de jogadores, clubes e batalhas
  - 5 minutos: rankings
  - 10 minutos: eventos
  - 1 hora: dados estáticos (brawlers, ícones, modos)

## 📁 Estrutura do Projeto

```
brawl-lookup-pro-nodejs/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # Context providers
│   │   └── lib/           # Utilitários
│   └── index.html
├── server/                 # Backend Node.js
│   ├── _core/             # Configurações core
│   │   ├── index.ts       # Entry point do servidor
│   │   ├── trpc.ts        # Configuração tRPC
│   │   ├── oauth.ts       # Autenticação OAuth
│   │   └── vite.ts        # Integração Vite
│   ├── brawlApi.ts        # Cliente API Brawl Stars
│   ├── db.ts              # Operações de banco de dados
│   └── routers.ts         # Rotas tRPC
├── drizzle/               # Schema e migrations do banco
│   ├── schema.ts          # Definição das tabelas
│   └── migrations/        # Arquivos de migration
├── shared/                # Código compartilhado
│   ├── types.ts           # Tipos TypeScript
│   └── const.ts           # Constantes
├── package.json
├── tsconfig.json
├── vite.config.ts
└── drizzle.config.ts
```

## ☁️ Considerações de Hospedagem

Este projeto é uma aplicação full-stack Node.js/React e pode ser hospedado em diversas plataformas. Abaixo estão algumas opções e considerações:

### Plataformas Recomendadas

- **Vercel / Netlify**: Ideal para o frontend (React com Vite). Eles oferecem deploy contínuo e CDN para arquivos estáticos.
- **Render / Heroku / DigitalOcean App Platform**: Boas opções para o backend (Node.js com Express e tRPC). Suportam aplicações Node.js e permitem a configuração de variáveis de ambiente e bancos de dados.
- **Provedores de VPS (AWS EC2, Google Cloud, Azure VM)**: Para controle total sobre o ambiente. Requer mais configuração manual (servidor web como Nginx/Apache, PM2 para gerenciar processos Node.js, etc.).

### Requisitos

- **Node.js Runtime**: A plataforma deve suportar Node.js 22.x ou superior.
- **Banco de Dados MySQL**: Um serviço de banco de dados MySQL (ex: AWS RDS, PlanetScale, ou um servidor MySQL auto-hospedado) é necessário para o Drizzle ORM.
- **Variáveis de Ambiente**: Todas as variáveis listadas em `.env.example` devem ser configuradas na plataforma de hospedagem (especialmente `BRAWL_TOKEN`, `DATABASE_URL`, `MANUS_OAUTH_CLIENT_ID`, `MANUS_OAUTH_CLIENT_SECRET`).
- **Build Process**: A plataforma deve ser capaz de executar `pnpm install` e `pnpm build` para gerar os arquivos de produção.
- **Servidor Web**: Para o frontend, os arquivos estáticos gerados pelo `vite build` (na pasta `dist/public`) precisam ser servidos. Para o backend, o servidor Node.js (`dist/index.js`) precisa estar rodando e acessível.

### Configuração de Deploy (Exemplo com Render)

1. **Conectar Repositório Git**: Conecte seu repositório Git (GitHub, GitLab, Bitbucket) à plataforma de hospedagem.
2. **Configurar Build Command**: `pnpm install && pnpm build`
3. **Configurar Start Command**: `pnpm start`
4. **Variáveis de Ambiente**: Adicione as variáveis de ambiente (BRAWL_TOKEN, DATABASE_URL, etc.) na interface da plataforma.
5. **Banco de Dados**: Configure a conexão com seu banco de dados MySQL externo.

## 🔐 Segurança

- Validação de tags do Brawl Stars
- Normalização automática de tags (O → 0)
- Proteção de rotas com autenticação
- Sanitização de inputs
- Timeouts em requisições HTTP

## 🐛 Debug

Em modo desenvolvimento, logs do navegador são coletados automaticamente em `.manus-logs/`:
- `browserConsole.log` - Logs do console
- `networkRequests.log` - Requisições de rede
- `sessionReplay.log` - Eventos de sessão

## 📝 Notas

- O projeto já está configurado para Node.js e não requer conversão adicional
- Todas as funcionalidades e integrações foram mantidas
- O TypeScript é transpilado automaticamente para JavaScript durante o build
- O projeto usa ESM (ECMAScript Modules) nativamente

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.
