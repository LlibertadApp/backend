# backend

## DB setup

Crear localmente el archivo de environment .env y agregar la contraseña del usuario PG. Prerequisito: Tener git instalado en el sistema.

```bash
touch .env
echo "POSTGRES_PASSWORD=pw" >> .env
```

Teniendo PG correctamente instalado y corriendo en el puerto 5432, o en el docker con el puerto forwardeado, correr:

```bash
sh create_db.sh 
```
5432 es el puerto default de postgres. Pueden cambiarlo si lo necesitan. Es decir, si no tienen el ENV, van a tener que 
pasarle el puerto tal que sh create_db.sh 5432

# Correr el docker-compose

Primero, se bajan docker desktop desde [Descargar Docker Desktop](https://docs.docker.com/compose/install/#scenario-one-install-docker-desktop)
que ya trae consigo el docker-compose.
Luego, se paran en la carpeta dev-tools. Esto es importante porque es donde está el dockerfile.

# CONFIGURACION DE VARIABLES DE ENTORNO
Para la variable LBERTAPP_ENV, van a tener que crearse una cuenta de Amazon



# IMPORTANTE
Finalizados estos pasos, sigan la guía del README.MD que se encuentra en la carpeta dev-tools.
Para ejecutar el proyecto, no se usa npm run local, ya que al ser una instancia de lambda, cuesta $$
Por esto mismo se usa docker para levantar la DB.
En el path: LIBERTAPP_ENV=local ? 

WIP


