# backend

## DB setup

Crear localmente el archivo de environment .env y agregar la contraseña del usuario PG. Prerequisito: Tener git instalado en el sistema.

```bash
touch .env
echo "POSTGRES_PASSWORD=pw" >> .env
```

# Antes de leer esto, realizar los prerequisitos, paso 1 & 2 del Readme.md ubicado en la carpeta dev-tools.
Teniendo PG correctamente instalado y corriendo en el puerto 5432, o en el docker con el puerto forwardeado, correr:

```bash (script para unix-based systems)
sh create_db.sh 5432
```

```bash (script para windows )
./ migration.bat 5432
```

5432 es el puerto default de postgres. Pueden cambiarlo si lo necesitan. 


# Correr el docker-compose

Primero, se bajan docker desktop desde [Descargar Docker Desktop](https://docs.docker.com/compose/install/#scenario-one-install-docker-desktop)
que ya trae consigo el docker-compose.
Luego, se paran en la carpeta dev-tools. Esto es importante porque es donde está el dockerfile.

# CONFIGURACION DE VARIABLES DE ENTORNO
Para la variable LBERTAPP_ENV, van a tener que crearse una cuenta de Amazon

# Correr el proyecto
Es necesario correr este comando para instalar la dependencia serverless-offline, que permite correr el proyecto localmente.

```bash
npm install -g serverless-offline
```

Hay que instalar solo el CLI a nivel global (webpack-cli) y no como dependencia del proyecto, ya que sino no funciona.

```bash
npm install -g webpack-cli
```

Los links a los que se puede entrar son el /config y el /actas, lo demás lo crea automático


# IMPORTANTE
Finalizados estos pasos, sigan la guía del README.MD que se encuentra en la carpeta dev-tools.
Para ejecutar el proyecto, no se usa npm run local, ya que al ser una instancia de lambda, cuesta $$
Por esto mismo se usa docker para levantar la DB.
En el path: LIBERTAPP_ENV=local ? 

WIP


