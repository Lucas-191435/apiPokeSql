#!/bin/bash

# Script para gerenciar a aplicação Pokemon SQL API na VPS
# Torne este arquivo executável: chmod +x deploy.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funções utilitárias
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Verificar se o Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado. Instale o Docker primeiro."
    fi

    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado. Instale o Docker Compose primeiro."
    fi
}

# Setup inicial
setup() {
    log "Configurando ambiente inicial..."
    
    # Criar diretórios necessários
    mkdir -p backups ssl tmp/avatarProfile
    
    # Copiar arquivo de ambiente se não existir
    if [ ! -f .env ]; then
        if [ -f .env.production ]; then
            cp .env.production .env
            warn "Arquivo .env criado a partir de .env.production. Configure as variáveis antes de continuar!"
            warn "Edite o arquivo .env e ajuste as configurações para sua VPS"
            exit 1
        else
            error "Arquivo .env.production não encontrado!"
        fi
    fi
    
    log "Setup inicial concluído!"
}

# Build da aplicação
build() {
    log "Fazendo build da aplicação..."
    docker-compose build --no-cache
    log "Build concluído!"
}

# Deploy completo
deploy() {
    log "Iniciando deploy..."
    
    check_docker
    
    # Parar containers se estiverem rodando
    log "Parando containers existentes..."
    docker-compose down || true
    
    # Build da imagem
    build
    
    # Subir containers
    log "Subindo containers..."
    docker-compose up -d
    
    # Aguardar containers ficarem prontos
    log "Aguardando containers ficarem prontos..."
    sleep 30
    
    # Verificar status
    status
    
    log "Deploy concluído!"
}

# Verificar status dos containers
status() {
    log "Status dos containers:"
    docker-compose ps
    
    echo ""
    log "Logs recentes:"
    docker-compose logs --tail=20 api
}

# Ver logs
logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Backup do banco de dados
backup() {
    local backup_file="backups/backup-$(date +%Y%m%d_%H%M%S).sql"
    log "Criando backup do banco de dados..."
    
    docker-compose exec db mysqldump -u root -p$(grep DB_ROOT_PASSWORD .env | cut -d '=' -f 2) --all-databases > "$backup_file"
    
    if [ $? -eq 0 ]; then
        log "Backup criado com sucesso: $backup_file"
    else
        error "Falha ao criar backup!"
    fi
}

# Restaurar backup
restore() {
    if [ -z "$1" ]; then
        error "Uso: $0 restore <arquivo_backup.sql>"
    fi
    
    if [ ! -f "$1" ]; then
        error "Arquivo de backup não encontrado: $1"
    fi
    
    warn "ATENÇÃO: Esta operação irá sobrescrever todos os dados do banco!"
    read -p "Deseja continuar? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        log "Restaurando backup: $1"
        docker-compose exec -T db mysql -u root -p$(grep DB_ROOT_PASSWORD .env | cut -d '=' -f 2) < "$1"
        log "Backup restaurado com sucesso!"
    else
        log "Operação cancelada."
    fi
}

# Atualizar aplicação
update() {
    log "Atualizando aplicação..."
    
    # Pull das últimas mudanças (se usando Git)
    if [ -d ".git" ]; then
        log "Fazendo pull do repositório..."
        git pull
    fi
    
    # Rebuild e redeploy
    deploy
}

# Executar migrations do Prisma
migrate() {
    log "Executando migrations do Prisma..."
    docker-compose exec api npx prisma migrate deploy
    log "Migrations executadas!"
}

# Gerar cliente Prisma
generate() {
    log "Gerando cliente Prisma..."
    docker-compose exec api npx prisma generate
    log "Cliente Prisma gerado!"
}

# Reiniciar aplicação
restart() {
    log "Reiniciando aplicação..."
    docker-compose restart api
    log "Aplicação reiniciada!"
}

# Parar aplicação
stop() {
    log "Parando aplicação..."
    docker-compose down
    log "Aplicação parada!"
}

# Limpar recursos não utilizados
cleanup() {
    log "Limpando recursos Docker não utilizados..."
    docker system prune -f
    docker volume prune -f
    log "Limpeza concluída!"
}

# Menu de ajuda
help() {
    echo "Pokemon SQL API - Script de Deploy"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  setup     - Configuração inicial do ambiente"
    echo "  build     - Build da aplicação"
    echo "  deploy    - Deploy completo (parar, build, subir)"
    echo "  update    - Atualizar e redeploy"
    echo "  status    - Ver status dos containers"
    echo "  logs      - Ver logs (use 'logs api' para logs específicos)"
    echo "  restart   - Reiniciar aplicação"
    echo "  stop      - Parar aplicação"
    echo "  migrate   - Executar migrations do Prisma"
    echo "  generate  - Gerar cliente Prisma"
    echo "  backup    - Criar backup do banco"
    echo "  restore   - Restaurar backup (uso: restore arquivo.sql)"
    echo "  cleanup   - Limpar recursos Docker não utilizados"
    echo "  help      - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 deploy"
    echo "  $0 logs api"
    echo "  $0 backup"
    echo "  $0 restore backups/backup-20240328_120000.sql"
}

# Main
case "$1" in
    setup) setup ;;
    build) build ;;
    deploy) deploy ;;
    update) update ;;
    status) status ;;
    logs) logs "$2" ;;
    restart) restart ;;
    stop) stop ;;
    migrate) migrate ;;
    generate) generate ;;
    backup) backup ;;
    restore) restore "$2" ;;
    cleanup) cleanup ;;
    help|*) help ;;
esac