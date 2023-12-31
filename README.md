# INFO

**Español:** Este proyecto y/o repositorio, al igual que todos los demás, está liberado bajo la licencia AGPL. Para más información, visita este enlace: [README](https://github.com/LlibertadApp/.github/blob/main/profile/README.md).

**English** This project and/or repository, like all others, is released under the AGPL license. For more information, please visit this link: [README](https://github.com/LlibertadApp/.github/blob/main/profile/README.md).




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

Hay que instalar el CLI a nivel global (webpack-cli) y tambien el webpack comun (webpack) y no como dependencia del proyecto, ya que sino no funciona.

```bash
npm install -g webpack-cli
npm install -g webpack
```

Los links a los que se puede entrar son el /config y el /actas, lo demás lo crea automático


# IMPORTANTE
Finalizados estos pasos, sigan la guía del README.MD que se encuentra en la carpeta dev-tools.
Para ejecutar el proyecto, no se usa npm run local, ya que al ser una instancia de lambda, cuesta $$
Por esto mismo se usa docker para levantar la DB.

# Así quedaría el .env (de la rama del ORM, sino, simplemente dejen la linea 64 y la de POSTGRES_PASSWORD=pw)

```bash
POSTGRES_PASSWORD=la_libertad_app
NODE_OPTIONS=--enable-source-maps
BUCKET_NAME=lla.api
FIREBASE_WEB_API_KEY=
CACHE_TTL=max-age=0
LBERTAPP_ENV=local

# DATABASE
DB_LOCAL_ENDPOINT=postgresql://postgres:la_libertad_app@localhost:5432/la_libertad_app
DB_WRITE_ENDPOINT=test
DB_READ_ENDPOINT=test

# DATABASE CONFIG FOR TYPEORM
DATABASE_RO_HOST=localhost
DATABASE_RW_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=la_libertad_app
DATABASE_DB=la_libertad_app
DATABASE_LOGGING=false
DATABASE_SYNC=false
DATABASE_TYPE="postgres"

# FIREBASE CONFIG
FIREBASE_PUBLIC_KEYS_URL=https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_PRIVATE_KEY=
FIREBASE_SERVICE_ACCOUNT_SECRET_NAME=firebaseServiceAccount

# FRONT END URL CONFIG
FRONT_END_URL=http://localhost:3001

```

# Finalmente
Una vez configurado todo se ejecuta el siguiente comando para correr la migración localmente
```bash
npm run typeorm:local
```

y luego para correrlo localmente
```bash
npm run local
```

NOTA: Para produccion se supone que las .env vienen preseteadas entonces usar el de typeorm nomas
o sea npm run typeorm

# Team DevOPS
Actualizar el dockerfile para que instale webpack, webpack-cli y serverless-offline porque los toma local y no del proyecto
Chequear que corra las migraciones antes de deployear, o sea que lo agreguen al script original del docker-compose up / que lo hagan manualmente
La migración se hace una sola vez 

# Documentacion
Update tema contratos de APIs, se avanzó implementando una herramienta que auto genera la documetacion bajo la spec OAS 2.0 y expone un Swagger UI (Ver https://github.com/LlibertadApp/backend/issues/42 https://github.com/LlibertadApp/backend/pull/50)

En cuanto a como accederlo, se esta avanzando con @[PM - INFRA|SEG] Alelb22  para la integración de CI/CD para el pipeline del stack serverless que estamos manejando. (Ver https://github.com/LlibertadApp/backend/issues/52 https://github.com/LlibertadApp/backend/pull/53)
Aplicado esto se podrá acceder a la documentación a traves de /swagger, aqui econtraran el front end, y el crudo en spec OAS 2 en /swagger.json.
La idea es que cada vez que se pushean cambios a la rama de desarrollo, se dispararia un evento en Github actions que generaria la documentación automatica y la expone. (ESTO NO APLICA AL STAGE prd).

