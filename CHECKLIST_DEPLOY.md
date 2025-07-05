
# ✅ Checklist de Deploy - Sistema de Gestão de Apartamentos

Use este checklist para garantir que todos os passos foram executados corretamente.

## 📋 Pré-Deploy

### GitHub
- [ ] Repositório criado no GitHub
- [ ] Código enviado para o repositório
- [ ] Repositório configurado como público (necessário para Vercel gratuito)

### Arquivos Locais
- [ ] Arquivo `.env.example` está presente
- [ ] Scripts de setup estão funcionando
- [ ] Build local funciona sem erros (`npm run build`)

---

## 🗄️ Configuração do Supabase

### Criação do Projeto
- [ ] Conta criada no Supabase
- [ ] Projeto criado com nome `sistema-apartamentos`
- [ ] Região definida como `South America (São Paulo)`
- [ ] Senha do banco anotada com segurança

### Configuração do Banco
- [ ] URL de conexão obtida e anotada
- [ ] Teste de conexão realizado
- [ ] Migrações aplicadas (`npx prisma migrate deploy`)
- [ ] Cliente Prisma gerado (`npx prisma generate`)
- [ ] Dados iniciais populados (`npx tsx scripts/setup-supabase.ts`)

### Verificação dos Dados
- [ ] Usuário administrador criado (`thiago_pera@me.com`)
- [ ] Apartamentos exemplo criados (Apartamento 1 e 2)
- [ ] Clientes exemplo criados (Maria Silva e João Santos)
- [ ] Reservas exemplo criadas
- [ ] Categorias padrão criadas (Limpeza, Manutenção, etc.)

---

## 🚀 Deploy no Vercel

### Configuração do Projeto
- [ ] Conta criada no Vercel
- [ ] Projeto importado do GitHub
- [ ] Framework detectado como Next.js
- [ ] Configurações de build mantidas padrão

### Variáveis de Ambiente
- [ ] `DATABASE_URL` configurada (URL do Supabase)
- [ ] `NEXTAUTH_SECRET` configurada (chave aleatória 32+ caracteres)
- [ ] `NEXTAUTH_URL` configurada (URL do app)

### Deploy
- [ ] Primeiro deploy realizado com sucesso
- [ ] URL do app anotada
- [ ] `NEXTAUTH_URL` atualizada com URL real
- [ ] Redeploy realizado após atualização

---

## ✅ Testes Pós-Deploy

### Acesso ao Sistema
- [ ] Sistema acessível via URL
- [ ] Tela de login carregando corretamente
- [ ] Login realizado com sucesso (`thiago_pera@me.com` / `Thi?242631`)

### Funcionalidades Principais
- [ ] Dashboard carregando com estatísticas
- [ ] Lista de apartamentos funcionando
- [ ] Lista de clientes funcionando
- [ ] Criação de nova reserva funcionando
- [ ] Calendário exibindo reservas
- [ ] Adição de despesas funcionando
- [ ] Gerenciamento de tarefas funcionando
- [ ] Logout funcionando corretamente

### Performance
- [ ] Tempo de carregamento aceitável (< 3 segundos)
- [ ] Navegação entre páginas fluida
- [ ] Formulários salvando corretamente
- [ ] Dados persistindo entre sessões

---

## 🔧 Configurações Adicionais

### Segurança
- [ ] Credenciais padrão alteradas (opcional mas recomendado)
- [ ] Novo usuário administrador criado (opcional)
- [ ] Variáveis de ambiente não expostas publicamente

### Monitoramento
- [ ] Dashboard do Vercel funcionando
- [ ] Logs do Supabase acessíveis
- [ ] Alertas de erro configurados (opcional)

### Backup
- [ ] Backup automático configurado no Supabase
- [ ] Estratégia de backup documentada

---

## 📊 Verificação de Limites

### Vercel (Plano Gratuito)
- [ ] Largura de banda: 100GB/mês
- [ ] Deploys ilimitados
- [ ] Tempo de função: 10 segundos
- [ ] Domínio personalizado disponível

### Supabase (Plano Gratuito)
- [ ] Armazenamento: 500MB
- [ ] Transferência: 5GB/mês
- [ ] Projetos: 2 máximo
- [ ] Backup: 7 dias

---

## 🎯 Pós-Deploy

### Documentação
- [ ] URLs importantes anotadas
- [ ] Credenciais salvas com segurança
- [ ] Guia de deploy seguido completamente
- [ ] Checklist preenchido

### Personalização
- [ ] Apartamentos reais adicionados
- [ ] Categorias personalizadas criadas
- [ ] Dados exemplo removidos/atualizados
- [ ] Configurações ajustadas para uso real

### Treinamento
- [ ] Usuários finais treinados
- [ ] Fluxos de trabalho definidos
- [ ] Responsabilidades atribuídas

---

## 🆘 Problemas Comuns e Soluções

### ❌ Erro de Conexão com Banco
**Solução**: Verifique URL, senha e conectividade
- [ ] URL do banco verificada
- [ ] Senha correta
- [ ] Teste de conexão realizado

### ❌ Erro de Build no Vercel
**Solução**: Verifique variáveis de ambiente e logs
- [ ] Variáveis de ambiente verificadas
- [ ] Logs de build analisados
- [ ] Redeploy realizado

### ❌ Erro de Autenticação
**Solução**: Verifique configuração NextAuth
- [ ] `NEXTAUTH_SECRET` configurado
- [ ] `NEXTAUTH_URL` correto
- [ ] Cookies limpos

### ❌ Página em Branco
**Solução**: Verifique dados e logs
- [ ] Banco populado com dados
- [ ] Script de setup executado
- [ ] Logs verificados

---

## 📞 Informações de Contato

### Suporte Técnico
- **Email**: thiago_pera@me.com
- **Sistema**: ✅ Funcionando
- **Versão**: 1.0.0

### URLs Importantes
- **Sistema**: https://seu-app.vercel.app
- **Supabase**: https://app.supabase.com
- **Vercel**: https://vercel.com/dashboard
- **GitHub**: https://github.com/SEU_USUARIO/sistema-apartamentos

### Credenciais Padrão
- **Email**: thiago_pera@me.com
- **Senha**: Thi?242631

---

## 🎉 Status Final

- [ ] **Deploy Completo**: Sistema funcionando na nuvem
- [ ] **Testes Aprovados**: Todas as funcionalidades testadas
- [ ] **Documentação**: Guias e checklists completos
- [ ] **Pronto para Uso**: Sistema pronto para produção

**Data do Deploy**: ___/___/2024
**Responsável**: _________________
**Status**: ✅ Concluído com Sucesso

---

**Parabéns! 🎊**
Seu sistema de gestão de apartamentos está agora rodando na nuvem e pronto para ser usado de qualquer lugar do mundo!
