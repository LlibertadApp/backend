# backend

## DB setup

Crear localmente el archivo de environment .env y agregar la contraseña del usuario PG

```bash
touch .env
echo "POSTGRES_PASSWORD=pw" >> .env
```

Teniendo PG correctamente instalado y corriendo en el puerto 5432, o en el docker con el puerto forwardeado, correr:

```bash
sh create_db.sh 5432
```
