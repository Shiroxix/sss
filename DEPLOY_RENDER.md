# Guia Completo: Deploy do Brawl Lookup Pro no Render

## 📋 Visão Geral

O **Render** (onrender.com) é uma plataforma de hospedagem moderna que oferece suporte completo para aplicações Node.js. Este guia fornece instruções passo a passo para fazer o deploy do Brawl Lookup Pro no Render com sucesso.

## ✅ Pré-requisitos

Antes de começar, você precisará de:

1. **Conta no Render**: Crie uma conta gratuita em [render.com](https://render.com)
2. **Repositório Git**: Seu projeto deve estar em um repositório Git (GitHub, GitLab ou Bitbucket)
3. **Banco de Dados MySQL**: Um serviço MySQL externo (recomendações abaixo)
4. **Variáveis de Ambiente**: Todos os tokens e credenciais necessários

## 🗄️ Configurar Banco de Dados MySQL

O Render não oferece MySQL nativo, mas você pode usar serviços externos:

### Opção 1: PlanetScale (Recomendado - Gratuito)

**PlanetScale** é um serviço de MySQL serverless que oferece um plano gratuito generoso.

1. Acesse [planetscale.com](https://planetscale.com) e crie uma conta
2. Crie um novo banco de dados (ex: `brawl-lookup-pro`)
3. Vá para **Connect** e copie a string de conexão MySQL
4. A URL terá o formato: `mysql://usuario:senha@host/database`
5. Guarde esta URL para usar no Render

### Opção 2: AWS RDS (Pago, mas robusto)

1. Acesse [AWS RDS](https://aws.amazon.com/rds/)
2. Crie uma instância MySQL
3. Configure a segurança para aceitar conexões do Render
4. Copie o endpoint da instância

### Opção 3: Clever Cloud (Gratuito com limitações)

1. Acesse [clever-cloud.com](https://www.clever-cloud.com/)
2. Crie um banco de dados MySQL
3. Copie a string de conexão

## 🚀 Deploy no Render - Passo a Passo

### Passo 1: Preparar o Repositório Git

Certifique-se de que seu projeto está versionado com Git e enviado para um repositório remoto:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

### Passo 2: Conectar Render ao Repositório

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **New +** no canto superior direito
3. Selecione **Web Service**
4. Escolha **Connect a repository** e selecione seu repositório Git
5. Autorize o Render a acessar seu repositório

### Passo 3: Configurar o Web Service

Na página de criação do Web Service, preencha os seguintes campos:

| Campo | Valor |
|-------|-------|
| **Name** | `brawl-lookup-pro` (ou seu nome preferido) |
| **Environment** | `Node` |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `pnpm start` |
| **Plan** | `Free` (ou pago, se preferir) |

### Passo 4: Adicionar Variáveis de Ambiente

Na mesma página, role para baixo até a seção **Environment Variables** e adicione:

| Chave | Valor | Notas |
|-------|-------|-------|
| `NODE_ENV` | `production` | Obrigatório |
| `PORT` | `3000` | Porta padrão |
| `BRAWL_TOKEN` | Seu token da Supercell | Obtenha em [developer.brawlstars.com](https://developer.brawlstars.com) |
| `DATABASE_URL` | URL do PlanetScale/RDS | Ex: `mysql://user:pass@host/db` |
| `MANUS_OAUTH_CLIENT_ID` | Seu client ID | Se usar autenticação Manus |
| `MANUS_OAUTH_CLIENT_SECRET` | Seu client secret | Se usar autenticação Manus |
| `OWNER_OPEN_ID` | Seu OpenID | Seu ID de proprietário (admin) |
| `JWT_SECRET` | Uma string aleatória | Use: `openssl rand -base64 32` |
| `VITE_APP_ID` | Seu app ID | Se necessário |
| `OAUTH_SERVER_URL` | URL do servidor OAuth | Se usar autenticação Manus |

### Passo 5: Deploy

1. Clique em **Create Web Service**
2. O Render começará a fazer o build e deploy automaticamente
3. Você pode acompanhar o progresso na aba **Logs**
4. Quando terminar, você receberá uma URL pública (ex: `https://brawl-lookup-pro.onrender.com`)

## 🔧 Configurações Importantes

### Build Command

O comando de build deve compilar tanto o frontend quanto o backend:

```bash
pnpm install && pnpm build
```

Este comando:
- Instala todas as dependências
- Compila o React (Vite) para `dist/public`
- Compila o servidor Node.js para `dist/index.js`

### Start Command

```bash
pnpm start
```

Este comando inicia o servidor Node.js em modo produção, servindo tanto a API quanto os arquivos estáticos do frontend.

### Timeout de Build

O plano gratuito do Render tem um timeout de build de 30 minutos. Se seu build exceder esse tempo, considere fazer upgrade para um plano pago ou otimizar o build.

## 🔐 Segurança

### Gerar JWT_SECRET

Para gerar um `JWT_SECRET` seguro, você pode simplesmente **digitar uma sequência de caracteres forte e aleatória** que servirá como sua chave secreta. Pense em algo como uma senha complexa e única. Exemplo:

```
MinhaChaveJWTSecretaMuitoForte123!@#
```

Copie essa chave e adicione como variável de ambiente `JWT_SECRET` no Render.

### Proteger Variáveis Sensíveis

Nunca commit suas variáveis de ambiente no Git. Use um arquivo `.env` local e adicione-o ao `.gitignore`:

```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
git push
```

## 📊 Monitoramento

### Logs

Acesse os logs do seu serviço no Render:
1. Vá para seu Web Service no dashboard
2. Clique na aba **Logs**
3. Veja logs em tempo real do seu aplicativo

### Métricas

O Render oferece métricas de CPU, memória e requisições na aba **Metrics**.

## 🐛 Troubleshooting

### Build Falha

Se o build falhar, verifique os logs para erros. Causas comuns:

- **Dependências não instaladas**: Certifique-se de que `pnpm install` está no build command
- **Variáveis de ambiente faltando**: Verifique se todas as variáveis obrigatórias estão configuradas
- **Banco de dados não acessível**: Teste a conexão com o banco de dados

### Aplicação Não Inicia

Se a aplicação não inicia após o build bem-sucedido:

- Verifique se `PORT` está configurado como `3000`
- Verifique se `DATABASE_URL` está correto
- Verifique os logs para erros específicos

### Erro de Conexão com Banco de Dados

Se receber erro de conexão com o banco:

1. Verifique se a `DATABASE_URL` está correta
2. Se usar PlanetScale, certifique-se de que a conexão SSL está habilitada
3. Teste a conexão localmente com a mesma URL

## 🔄 Atualizações e Redeploy

Sempre que você fazer push para seu repositório Git, o Render detectará as mudanças e fará um redeploy automático.

Para forçar um redeploy manual:
1. Vá para seu Web Service no Render
2. Clique em **Manual Deploy**
3. Selecione o branch que deseja fazer deploy

## 💰 Custos

O plano **Free** do Render oferece:
- Até 750 horas/mês de computação
- Suficiente para um site com tráfego baixo a médio
- Serviço é pausado se inativo por 15+ minutos

Para aplicações em produção com tráfego maior, considere fazer upgrade para um plano pago.

## 📞 Suporte

Se encontrar problemas:

1. Verifique a [documentação oficial do Render](https://render.com/docs)
2. Consulte os [logs do seu serviço](https://dashboard.render.com)
3. Abra uma issue no repositório do projeto

## ✨ Dicas Extras

### Usar Domínio Customizado

Para usar seu próprio domínio:
1. Vá para **Settings** do seu Web Service
2. Clique em **Add Custom Domain**
3. Configure o DNS do seu domínio para apontar para o Render

### Habilitar Auto-Deploy

O Render já faz auto-deploy por padrão quando você faz push para o repositório. Você pode desabilitar isso em **Settings** > **Auto-Deploy**.

### Escalar a Aplicação

Se a aplicação receber muito tráfego:
1. Vá para **Settings** do seu Web Service
2. Aumente o **Plan** para um com mais recursos
3. Configure **Auto-scaling** se disponível no seu plano

## 🎉 Conclusão

Seu Brawl Lookup Pro agora está rodando no Render! Você pode acessá-lo através da URL pública fornecida e compartilhá-la com outros usuários.

Para mais informações sobre o Render, visite [render.com/docs](https://render.com/docs).
