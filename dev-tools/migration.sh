#!/bin/bash

export PGPASSWORD=$POSTGRES_PASSWORD

DB_NAME="la_libertad_app"
SCRIPT_PATH="schema.sql"
PORT=$1

if [ -z "$PORT" ]; then
    echo "Por favor, proporciona el puerto para PostgreSQL como argumento."
    exit 1
fi

DB_CONTAINER_EXISTS=$(docker ps -q --filter "name=lfdc_postgres_local")

if [ -n "$DB_CONTAINER_EXISTS" ]; then
    read -p "El contenedor de la base de datos ya está en ejecución. ¿Deseas eliminarlo y crear uno nuevo? (escribe YES para confirmar): " CONFIRM
    if [ "$CONFIRM" = "YES" ]; then
        echo "DROP DATABASE $DB_NAME;" | docker exec -i lfdc_postgres_local psql -U postgres
        echo "CREATE DATABASE $DB_NAME;" | docker exec -i lfdc_postgres_local psql -U postgres
        docker stop lfdc_postgres_local
        docker rm lfdc_postgres_local
        echo "Contenedor de la base de datos eliminado."
    else
        echo "No se realizan acciones."
        exit 0
    fi
fi

echo "Creando y ejecutando el contenedor de la base de datos..."

docker-compose up -d

sleep 10

docker exec -i lfdc_postgres_local psql -U postgres -d $DB_NAME -a -f /docker-entrypoint-initdb.d/$SCRIPT_PATH
docker exec -i lfdc_postgres_local psql -U postgres -d $DB_NAME -a -f /docker-entrypoint-initdb.d/update_mesas_activas.sql

unset PGPASSWORD

echo "Contenedor de la base de datos creado y script ejecutado exitosamente."