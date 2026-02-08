# Guia: Detector de IP Protegido (Fácil para Render Gratuito)

## 🔐 Visão Geral

O projeto inclui uma rota protegida `/ip` que permite detectar o endereço IP de saída do seu servidor no Render. Esta rota é **protegida por uma chave secreta** para evitar que pessoas não autorizadas descubram o IP do seu servidor.

## 🛠️ Como Configurar (Sem Comandos!)

### 1. Escolha sua Chave Secreta

Em vez de gerar uma chave por comando, você pode simplesmente **digitar uma sequência de caracteres forte e aleatória** que servirá como sua chave secreta. Pense em algo como uma senha complexa. Exemplo:

```
MinhaChaveSecretaMuitoForte123!@#
```

**Importante**: Anote essa chave em um local seguro, pois você precisará dela para acessar o detector de IP.

### 2. Adicionar ao Arquivo `.env` (Localmente)

Se você for rodar o projeto localmente, adicione a chave escolhida ao seu arquivo `.env`:

```env
ADMIN_IP_KEY=MinhaChaveSecretaMuitoForte123!@#
```

### 3. Configurar no Render (Painel Visual)

Esta é a parte mais importante para o deploy no Render:

1.  Acesse o painel do Render: [dashboard.render.com](https://dashboard.render.com)
2.  Vá para seu **Web Service** (o serviço do seu projeto Brawl Lookup Pro).
3.  Clique em **Settings** (Configurações).
4.  Role até a seção **Environment Variables** (Variáveis de Ambiente).
5.  Adicione uma nova variável:
    *   **Key**: `ADMIN_IP_KEY`
    *   **Value**: (Cole ou digite a chave secreta que você escolheu no passo 1)

## 🔍 Como Usar

Depois de configurar a chave no Render, você pode acessar a rota de detecção de IP usando:

```
https://seusite.onrender.com/ip?key=MinhaChaveSecretaMuitoForte123!@#
```

Substitua:
-   `seusite.onrender.com` pela URL do seu site no Render.
-   `MinhaChaveSecretaMuitoForte123!@#` pela **sua chave secreta real**.

### Resultado

Se a chave estiver correta, você verá uma página com:
-   O IP de saída atual do seu servidor.
-   Um botão para copiar o IP automaticamente.

Se a chave estiver incorreta ou ausente, você receberá um erro **403 Forbidden**.

## ⚠️ Segurança

-   **Nunca compartilhe sua chave secreta** com ninguém.
-   **Nunca coloque a chave em comentários ou documentação pública**.
-   A rota só funciona se você passar a chave correta como parâmetro `key`.
-   A chave é verificada a cada requisição, portanto, se você a alterar no Render, a URL anterior deixará de funcionar.

## 🔄 Mudando a Chave

Se você suspeitar que sua chave foi comprometida:

1.  Escolha uma nova chave secreta (uma nova sequência de caracteres forte).
2.  Atualize a variável `ADMIN_IP_KEY` no painel do Render (na seção **Environment Variables**).
3.  Aguarde alguns minutos para que a mudança seja propagada.
4.  Use a nova chave para acessar a rota.

## 📝 Exemplo de Fluxo

1.  **Você recebe erro 403 na API da Supercell**.
2.  **Você acessa**: `https://seusite.onrender.com/ip?key=sua_chave_secreta_aqui`
3.  **Você vê o IP**: `123.45.67.89`
4.  **Você copia o IP** (clicando no botão).
5.  **Você adiciona o IP** no portal da Supercell.
6.  **A API funciona!**

## 🐛 Troubleshooting

### Erro 403 Forbidden
-   Verifique se você passou a chave corretamente na URL.
-   Verifique se a variável `ADMIN_IP_KEY` está configurada no Render (na seção **Environment Variables**).
-   Certifique-se de que não há espaços extras na chave.

### Erro ao detectar IP
-   Verifique se o servidor tem acesso à internet.
-   Tente novamente em alguns minutos.
-   Verifique os logs do Render para mais detalhes.

## 🔒 Por que Proteger?

Expor o IP do seu servidor publicamente pode:
-   Permitir que pessoas descubram informações sobre sua infraestrutura.
-   Facilitar ataques direcionados.
-   Comprometer a segurança do seu servidor.

Manter a rota protegida é essencial antes de divulgar seu site.
