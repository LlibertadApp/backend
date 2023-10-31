# Guía para Levantar un Entorno Docker Compose

Este README te guiará a través del proceso de levantar un entorno utilizando Docker Compose. Docker Compose es una herramienta que permite definir y ejecutar aplicaciones Docker con múltiples contenedores. En este ejemplo, usaremos un archivo `docker-compose.yml` para definir nuestros servicios y configuraciones.

## Requisitos Previos

Asegúrate de que tengas los siguientes requisitos previos instalados en tu sistema:

- Docker: [Instalación de Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Instalación de Docker Compose](https://docs.docker.com/compose/install/)

## Levantando el Entorno
Tenga en cuenta que esto sera unica y exclusivamente para el entorno de desarrollo, para el entorno de produccion se debera utilizar un archivo diferente y/o configuraciones diferentes.

1. **Edita el archivo `docker-compose.yml` (si es necesario):**

Puedes modificar el archivo `docker-compose.yml` para ajustar la configuración de tus servicios. Asegúrate de definir los servicios, puertos, volúmenes, variables de entorno, etc., según tus necesidades. (No sera necesario para este caso).

2. **Ejecuta el comando `docker-compose up`:**
```bash
docker-compose up -d
```

Este comando leerá el archivo `docker-compose.yml` y creará y ejecutará los contenedores de acuerdo con la configuración definida.

4. **Accede a tus servicios:**

Una vez que los contenedores estén en funcionamiento, podrás acceder a los servicios a través de los puertos especificados en el archivo `docker-compose.yml`. Abre un navegador web u otra herramienta para acceder a tus aplicaciones.

5. **Detener y Limpiar los Contenedores:** (No se recomienda para este caso)

No es necesario ya que eliminara todos los volumenes perdiendo la informacion de la base de datos, los archivos de la aplicacion y los archivos de cargados en MINIO.
Pero en caso de necesites, puedes detenerlos y eliminarlos utilizando el siguiente comando:

```bash
docker-compose down
```

Esto detendrá y eliminará los contenedores definidos en el archivo `docker-compose.yml`.

## Ejecutando la Migration

Deberas de ejecutar la migracion de la base de datos para que se creen las tablas necesarias para el funcionamiento de la aplicacion. ESTO SE HARA POR UNA UNICA VEZ Y SOLO CUANDO SE CREE LA BASE DE DATOS POR PRIMERA VEZ. (Necesitas tener los contenedores en funcionamiento). Para esto deberas de ejecutar el siguiente comando:

Linux:
```bash
cd dev-tools
sh create_db.sh
```

Windows:
```bash
cd dev-tools
create_db.bat
```