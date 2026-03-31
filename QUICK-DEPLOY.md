# 🚀 Deploy Rápido - Pokemon SQL API

## ⚡ Passo a Passo Resumido

### 1️⃣ Preparar VPS
```bash
# Instalar Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# IMPORTANTE: Sair e entrar novamente no SSH
```

### 2️⃣ Deploy da API
```bash
# Clonar projeto
cd /opt
sudo git clone <URL_REPO> pokemon-api
sudo chown -R $USER:$USER pokemon-api
cd pokemon-api

# Setup inicial
chmod +x deploy.sh
./deploy.sh setup

# Configurar .env (OBRIGATÓRIO!)
nano .env
# Ajuste SECRET_KEY, senhas do banco, APP_URL

# Deploy completo
./deploy.sh deploy
```

### 3️⃣ Configurar Domínio (Opcional)
```bash
# Editar nginx.conf
nano nginx.conf
# Substituir "seu-dominio.com" pelo seu domínio

# SSL com Let's Encrypt
sudo apt install certbot -y
./deploy.sh stop
sudo certbot certonly --standalone -d seu-dominio.com
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./ssl/private.key
sudo chown $USER:$USER ./ssl/*

# Descomentar linhas SSL no nginx.conf e reiniciar
./deploy.sh deploy
```

## 🔧 Comandos Essenciais

```bash
./deploy.sh status    # Ver status
./deploy.sh logs      # Ver logs
./deploy.sh backup    # Backup BD
./deploy.sh restart   # Reiniciar
./deploy.sh stop      # Parar tudo
```

## ✅ Verificar se Funcionou

```bash
# API local
curl http://localhost:3333/health

# Com domínio
curl https://seu-dominio.com/health

# Containers rodando
docker ps
```

## 🆘 Se Algo Der Errado

```bash
# Ver o que aconteceu
./deploy.sh logs api

# Reiniciar tudo
./deploy.sh stop
./deploy.sh deploy

# Verificar recursos
free -h
df -h
```

---

🎯 **Em 5 minutos sua API está no ar!**