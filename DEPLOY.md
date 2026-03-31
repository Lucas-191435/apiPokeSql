# 🚀 Deploy na VPS - Pokemon SQL API

Este guia explica como fazer o deploy da API Pokemon SQL na sua VPS usando Docker e Docker Compose.

## 📋 Pré-requisitos

### Na sua VPS:
- Ubuntu/Debian ou CentOS/RHEL
- Docker e Docker Compose instalados
- Git (para clonar o repositório)
- Porta 80 e 443 liberadas no firewall
- Pelo menos 2GB RAM e 20GB de espaço em disco

## 🔧 Instalação do Docker (Ubuntu/Debian)

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release -y

# Adicionar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
```

⚠️ **Saia e entre novamente na sessão SSH** após executar os comandos acima.

## 📥 Deploy da Aplicação

### 1. Clonar o Repositório
```bash
cd /opt
sudo git clone <URL_DO_SEU_REPOSITORIO> pokemon-api
sudo chown -R $USER:$USER pokemon-api
cd pokemon-api
```

### 2. Configurar Ambiente
```bash
# Tornar script executável
chmod +x deploy.sh

# Setup inicial (cria .env e diretórios)
./deploy.sh setup
```

### 3. Configurar Variáveis de Ambiente
Edite o arquivo `.env` com suas configurações:

```bash
nano .env
```

**Variáveis obrigatórias:**
```env
# Application Settings
SECRET_KEY=SuaChaveSecretaSuperSecreta123!
APP_URL=https://seu-dominio.com
ENVIRONMENT=production

# Database Configuration  
DB_ROOT_PASSWORD=SenhaRootMySQLSuperSecreta123!
DB_PASSWORD=SenhaBDSuperSecreta123!

# URLs (configure conforme necessário)
WHATSAPP_API_BASE_URL=https://api.whatsapp.com
WHATSAPP_API_TOKEN=seu_token_whatsapp
WEB_URL=https://seu-frontend.com
```

### 4. Configurar Nginx (Opcional - para HTTPS)
Edite `nginx.conf` e substitua `seu-dominio.com` pelo seu domínio real:

```bash
nano nginx.conf
# Substituir "seu-dominio.com" pelo seu domínio
```

### 5. Deploy
```bash
./deploy.sh deploy
```

## 🌐 Configurar SSL/HTTPS com Let's Encrypt

### 1. Instalar Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Gerar Certificados
```bash
# Parar Nginx temporariamente
./deploy.sh stop

# Gerar certificados
sudo certbot certonly --standalone -d seu-dominio.com -d www.seu-dominio.com

# Copiar certificados para o projeto
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./ssl/private.key
sudo chown $USER:$USER ./ssl/*

# Descomentar linhas SSL no nginx.conf
nano nginx.conf
```

### 3. Auto-renovação
```bash
# Adicionar cron job para renovação automática
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 4. Reiniciar com SSL
```bash
./deploy.sh deploy
```

## 🛠️ Comandos Úteis

```bash
# Ver status dos containers
./deploy.sh status

# Ver logs em tempo real
./deploy.sh logs

# Ver logs apenas da API
./deploy.sh logs api

# Fazer backup do banco
./deploy.sh backup

# Restaurar backup
./deploy.sh restore backups/backup-20240328_120000.sql

# Atualizar aplicação
./deploy.sh update

# Reiniciar apenas a API
./deploy.sh restart

# Executar migrations do Prisma
./deploy.sh migrate

# Parar tudo
./deploy.sh stop

# Limpar recursos não utilizados
./deploy.sh cleanup
```

## 🔍 Monitoramento

### Verificar se tudo está funcionando:
```bash
# Status dos containers
docker ps

# Verificar conectividade da API
curl -f http://localhost:3333/health

# Verificar logs
docker-compose logs -f api
```

### Métricas de Sistema:
```bash
# Uso de recursos
docker stats

# Espaço em disco
df -h

# Memória
free -h
```

## 🚨 Solução de Problemas

### Container da API não inicia:
1. Verificar logs: `./deploy.sh logs api`
2. Verificar variáveis de ambiente no `.env`
3. Verificar se o banco está rodando: `docker ps`

### Erro de conexão com banco:
1. Verificar se a `DATABASE_URL` está correta
2. Aguardar o banco ficar pronto: `docker-compose logs db`
3. Reiniciar: `./deploy.sh restart`

### Problemas de SSL:
1. Verificar se os certificados estão em `./ssl/`
2. Verificar configuração do nginx.conf
3. Verificar se o domínio está apontando para a VPS

### Container fica reiniciando:
1. Verificar logs: `./deploy.sh logs`
2. Verificar uso de memória: `free -h`
3. Verificar espaço em disco: `df -h`

## 🔐 Segurança

### Configurações recomendadas:
1. **Firewall:** Liberar apenas portas 22 (SSH), 80 (HTTP), 443 (HTTPS)
2. **Senhas:** Use senhas complexas no `.env`
3. **Updates:** Mantenha o sistema atualizado
4. **Backup:** Configure backups automáticos
5. **Monitoramento:** Configure alertas de sistema

### Backup automático diário:
```bash
# Adicionar ao cron
crontab -e

# Adicionar linha:
0 2 * * * cd /opt/pokemon-api && ./deploy.sh backup
```

## 📞 Suporte

Em caso de problemas:
1. Verificar logs: `./deploy.sh logs`
2. Verificar status: `./deploy.sh status`
3. Verificar recursos do sistema
4. Consultar documentação do Docker/Prisma

---

✅ **Pronto!** Sua API Pokemon SQL está rodando na VPS com Docker! 🐳