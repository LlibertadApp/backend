#!/bin/bash

# Variables
export $(grep -v '^#' ../.env | xargs)
export PGPASSWORD=$POSTGRES_PASSWORD

DB_NAME="la_libertad_app"
SCRIPT_PATH="schema.sql"
PORT=$1

# Verificar si se proporcionó el puerto
if [ -z "$PORT" ]; then
    echo "Por favor, proporciona el puerto para PostgreSQL como argumento."
    exit 1
fi

# Verificar si la base de datos ya existe
DB_EXISTS=$(psql -U postgres -t -p $PORT -l | grep $DB_NAME | wc -l)

if [ $DB_EXISTS -eq 1 ]; then
    read -p "La base de datos $DB_NAME ya existe. ¿Deseas eliminarla? (escribe YES para confirmar): " CONFIRM
    if [ "$CONFIRM" = "YES" ]; then
        dropdb -p $PORT $DB_NAME -U postgres 
        echo "Base de datos $DB_NAME eliminada."
    else
        echo "No se realizan acciones."
        exit 0
    fi
fi

echo "Creando la base de datos $DB_NAME..."

# Crear la base de datos
createdb -p $PORT $DB_NAME -U postgres

# Ejecutar el script .sql para inicializar la base de datos
psql -p $PORT -d $DB_NAME -a -f $SCRIPT_PATH -U postgres
psql -p $PORT -d $DB_NAME -a -f 'update_mesas_activas.sql' -U postgres

unset PGPASSWORD

echo "Base de datos $DB_NAME creada y script ejecutado exitosamente."

