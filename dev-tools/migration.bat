@echo off
setlocal enabledelayedexpansion

for /f "tokens=*" %%a in ('findstr /r /v "^#" ..\.env') do (
    for /f "tokens=1,2 delims==" %%b in ("%%a") do (
        set %%b=%%c
    )
)

set PGPASSWORD=!POSTGRES_PASSWORD!

set "DB_NAME=la_libertad_app"
set "SCRIPT_PATH=schema.sql"
set "PORT=%~1"

if "%PORT%"=="" (
    echo Por favor, proporciona el puerto para PostgreSQL como argumento.
    exit /b 1
)

for /f "tokens=*" %%a in ('docker ps -q --filter "name=lfdc_postgres_local"') do (
    set "CONTAINER_ID=%%a"
)

if defined CONTAINER_ID  (
    set /p "CONFIRM=El contenedor de la base de datos ya esta en ejecucion. Deseas eliminarlo y crear uno nuevo? (escribe YES para confirmar): "
    if /i "!CONFIRM!"=="YES" (
        docker stop lfdc_postgres_local
        docker rm lfdc_postgres_local
        echo Contenedor de la base de datos eliminado.
    ) else (
        echo No se realizan acciones.
        exit /b 0
    )
)



echo Creando y ejecutando el contenedor de la base de datos...
docker-compose up -d

timeout /t 10 /nobreak >nul

docker exec -i lfdc_postgres_local psql -U postgres -d %DB_NAME% -a -f /docker-entrypoint-initdb.d/%SCRIPT_PATH%

endlocal
echo Contenedor de la base de datos creado y script ejecutado exitosamente.
