#!/bin/bash

echo " B4You - Setup do Sistema de Produtos"
echo "========================================="

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "Docker não encontrado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "Docker encontrado"

# Parar containers se estiverem rodando
echo "Parando containers existentes..."
docker-compose down

# Construir e subir os containers
echo "Construindo e iniciando containers..."
docker-compose up -d --build

# Aguardar os containers subirem
echo "Aguardando containers iniciarem..."
sleep 15

# Executar migrações
echo "Executando migrações do banco de dados..."
docker-compose exec -T backend npm run db:migrate

# Executar seeds
echo "Populando banco com dados de exemplo..."
docker-compose exec -T backend npm run db:seed

echo ""
echo "Setup concluído com sucesso!"
echo ""
echo "URLs disponíveis:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo ""
echo "Credenciais de acesso:"
echo "   E-mail: admin@b4you.dev"
echo "   Senha: 123456"
echo ""
