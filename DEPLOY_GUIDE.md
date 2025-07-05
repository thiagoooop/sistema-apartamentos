
# 🚀 Guia Completo de Deploy - Sistema de Gestão de Apartamentos

Este guia te ajudará a fazer o deploy do sistema na nuvem usando **Vercel** (frontend) e **Supabase** (banco de dados PostgreSQL).

## 📋 Pré-requisitos

- Conta no GitHub (gratuita)
- Conta no Vercel (gratuita)
- Conta no Supabase (gratuita)

## 🎯 Resumo da Arquitetura

- **Frontend**: Vercel (NextJS + React)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: NextAuth.js
- **Custo**: Completamente gratuito para começar

---

## 🔧 PASSO 1: Preparar o Código no GitHub

### 1.1 Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique em "New repository"
3. Nome: `sistema-apartamentos`
4. Marque "Public" (necessário para plano gratuito do Vercel)
5. Clique em "Create repository"

### 1.2 Fazer Upload do Código

```bash
# No seu computador, navegue até a pasta do projeto
cd /home/ubuntu/sistema-apartamentos/app

# Inicializar git (se não existir)
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "Initial commit - Sistema de Gestão de Apartamentos"

# Conectar ao repositório remoto (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/sistema-apartamentos.git

# Enviar código para o GitHub
git push -u origin main
```

---

## 🗄️ PASSO 2: Configurar Banco de Dados no Supabase

### 2.1 Criar Conta no Supabase

1. Acesse [Supabase](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New project"

### 2.2 Configurar Projeto

1. **Organization**: Escolha sua organização pessoal
2. **Name**: `sistema-apartamentos`
3. **Database Password**: Anote bem essa senha! (ex: `MinhaSenh@123`)
4. **Region**: `South America (São Paulo)` (mais próximo do Brasil)
5. **Pricing Plan**: Free (0$/mês)
6. Clique em "Create new project"

⏱️ **Aguarde 2-3 minutos** para o projeto ser criado.

### 2.3 Obter Credenciais do Banco

1. No painel do Supabase, vá em **Settings** → **Database**
2. Na seção "Connection string", clique em "URI"
3. **Copie a URL** (será algo como):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
4. **Substitua `[YOUR-PASSWORD]`** pela senha que você criou no passo 2.2
5. **Anote essa URL** - será sua `DATABASE_URL`

---

## 🚀 PASSO 3: Deploy no Vercel

### 3.1 Criar Conta no Vercel

1. Acesse [Vercel](https://vercel.com)
2. Clique em "Sign up"
3. Escolha "Continue with GitHub"
4. Autorize o Vercel a acessar seus repositórios

### 3.2 Importar Projeto

1. No dashboard do Vercel, clique em "New Project"
2. Encontre o repositório `sistema-apartamentos`
3. Clique em "Import"
4. **Framework Preset**: Next.js (será detectado automaticamente)
5. **Root Directory**: `./` (deixe como está)
6. **Build Command**: `npm run build` (padrão)
7. **Output Directory**: `.next` (padrão)

### 3.3 Configurar Variáveis de Ambiente

Antes de fazer o deploy, você precisa configurar as variáveis de ambiente:

1. Na seção "Environment Variables", adicione:

```bash
# Banco de dados
DATABASE_URL = postgresql://postgres:SUA_SENHA@db.xxx.supabase.co:5432/postgres

# Autenticação (gere um secret aleatório)
NEXTAUTH_SECRET = sua-chave-secreta-muito-longa-e-aleatoria-aqui

# URL do seu app (será preenchida após o deploy)
NEXTAUTH_URL = https://seu-app.vercel.app
```

⚠️ **IMPORTANTE**: 
- Para `DATABASE_URL`: Use a URL do Supabase do passo 2.3
- Para `NEXTAUTH_SECRET`: Gere uma chave aleatória de 32+ caracteres
- Para `NEXTAUTH_URL`: Primeiro coloque uma URL temporária, depois atualize

### 3.4 Fazer o Deploy

1. Clique em "Deploy"
2. Aguarde o build (2-3 minutos)
3. **Anote a URL** do seu app (ex: `https://sistema-apartamentos-abc123.vercel.app`)

### 3.5 Atualizar NEXTAUTH_URL

1. Volte para **Settings** → **Environment Variables**
2. Encontre `NEXTAUTH_URL`
3. Clique em "Edit"
4. Substitua pela URL real do seu app
5. Clique em "Save"
6. Vá em **Deployments** e clique em "Redeploy" no último deploy

---

## 🗃️ PASSO 4: Configurar Banco de Dados

### 4.1 Executar Migrações

1. No seu computador, configure as variáveis de ambiente locais:

```bash
# Crie um arquivo .env.local (temporário)
cd /home/ubuntu/sistema-apartamentos/app
echo "DATABASE_URL=postgresql://postgres:SUA_SENHA@db.xxx.supabase.co:5432/postgres" > .env.local
```

2. Execute as migrações:

```bash
# Instalar dependências (se necessário)
npm install

# Aplicar migrações
npx prisma migrate deploy

# Gerar cliente Prisma
npx prisma generate
```

### 4.2 Popular Banco com Dados Iniciais

```bash
# Executar script de setup
npx tsx scripts/setup-supabase.ts
```

Você verá algo como:
```
🚀 Iniciando setup do Supabase...
✅ Conectado ao banco Supabase com sucesso!
👤 Criando usuário administrador...
✅ Usuário administrador criado: thiago_pera@me.com
📋 Criando categorias padrão...
✅ Categorias padrão criadas
🏠 Criando apartamentos exemplo...
✅ Apartamentos criados
👥 Criando clientes exemplo...
✅ Clientes exemplo criados
📅 Criando reservas exemplo...
✅ Reservas exemplo criadas
🎉 Setup do Supabase concluído com sucesso!
```

### 4.3 Limpar Arquivo Temporário

```bash
# Remover arquivo temporário
rm .env.local
```

---

## ✅ PASSO 5: Testar o Sistema

### 5.1 Acessar o Sistema

1. Acesse sua URL do Vercel (ex: `https://sistema-apartamentos-abc123.vercel.app`)
2. Você deve ver a tela de login

### 5.2 Fazer Login

Use as credenciais padrão:
- **Email**: `thiago_pera@me.com`
- **Senha**: `Thi?242631`

### 5.3 Verificar Funcionalidades

Teste as principais funcionalidades:
- ✅ Login/Logout
- ✅ Dashboard com estatísticas
- ✅ Listar apartamentos
- ✅ Listar clientes
- ✅ Criar nova reserva
- ✅ Visualizar calendário
- ✅ Adicionar despesas
- ✅ Gerenciar tarefas

---

## 🔧 Configurações Adicionais

### Domínio Personalizado (Opcional)

Se quiser usar um domínio próprio:

1. No Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruído
4. Atualize `NEXTAUTH_URL` com o novo domínio

### Backup do Banco

Para fazer backup regular:

1. No Supabase, vá em **Settings** → **Database**
2. Na seção "Database backups", configure backups automáticos

---

## 🆘 Solução de Problemas

### Erro de Conexão com Banco

```bash
# Teste a conexão
npx prisma db pull
```

Se der erro, verifique:
- ✅ URL do banco está correta
- ✅ Senha está correta
- ✅ Rede permite conexão na porta 5432

### Erro de Build no Vercel

1. Verifique os logs de build no Vercel
2. Certifique-se que todas as variáveis de ambiente estão configuradas
3. Tente fazer redeploy

### Erro de Autenticação

1. Verifique se `NEXTAUTH_SECRET` está configurado
2. Verifique se `NEXTAUTH_URL` está correto
3. Limpe cookies do navegador

### Página em Branco

1. Verifique se o banco foi populado com dados
2. Execute novamente o script de setup
3. Verifique logs no Vercel

---

## 📊 Limites do Plano Gratuito

### Vercel (Gratuito)
- ✅ 100GB de largura de banda/mês
- ✅ Deploy ilimitado
- ✅ Domínio personalizado
- ✅ SSL automático
- ⚠️ Funcões limitadas a 10 segundos

### Supabase (Gratuito)
- ✅ 500MB de armazenamento
- ✅ 5GB de transferência/mês
- ✅ 2 projetos
- ✅ Backups por 7 dias
- ⚠️ Projeto pausa após 1 semana de inatividade

---

## 🎯 Próximos Passos

### Depois do Deploy

1. **Altere as credenciais padrão**:
   - Crie um novo usuário administrador
   - Desative ou remova o usuário padrão

2. **Customize o sistema**:
   - Adicione seus apartamentos reais
   - Configure categorias específicas
   - Personalize cores e textos

3. **Monitore o uso**:
   - Acompanhe o dashboard do Vercel
   - Monitore uso do banco no Supabase

4. **Considere upgrades**:
   - Vercel Pro: $20/mês (sem limites de tempo)
   - Supabase Pro: $25/mês (8GB storage)

---

## 📞 Suporte

Se precisar de ajuda:

1. **Verificar logs**:
   - Vercel: Settings → Functions → View Function Logs
   - Supabase: Logs → Database

2. **Recursos úteis**:
   - [Documentação do Vercel](https://vercel.com/docs)
   - [Documentação do Supabase](https://supabase.com/docs)
   - [NextAuth.js Docs](https://next-auth.js.org/)

3. **Contato**:
   - Email: thiago_pera@me.com
   - Sistema funcionando: ✅ Sucesso!

---

## 🎉 Parabéns!

Seu sistema de gestão de apartamentos está agora rodando na nuvem, acessível de qualquer lugar do mundo! 🌍

**URLs importantes para salvar**:
- 🌐 **Seu sistema**: https://seu-app.vercel.app
- 🗄️ **Supabase**: https://app.supabase.com
- 🚀 **Vercel**: https://vercel.com/dashboard
- 📦 **GitHub**: https://github.com/SEU_USUARIO/sistema-apartamentos

**Credenciais de acesso**:
- 📧 **Email**: thiago_pera@me.com
- 🔑 **Senha**: Thi?242631

Agora você pode gerenciar seus apartamentos de qualquer lugar! 🏠✨
