CREATE TABLE provincias (
    id serial PRIMARY KEY,
    provincia_id integer,
    provincia_nombre varchar(255) NOT NULL
);

CREATE TABLE seccionprovinciales (
    id serial PRIMARY KEY,
    provincia_id integer,
    seccionprovincial_id integer,
    seccionprovincial_nombre varchar(255)
);
CREATE INDEX idx_seccionprovinciales_provincia ON seccionprovinciales(provincia_id);

CREATE TABLE secciones (
    id serial PRIMARY KEY,
    seccionprovincial_id integer,
    seccion_id integer,
    seccion_nombre varchar(255) NOT NULL
);
CREATE INDEX idx_secciones_seccionprovincial ON secciones(seccionprovincial_id);

CREATE TABLE circuitos (
    id serial PRIMARY KEY,
    seccion_id integer,
    circuito_id varchar(10),
    circuito_nombre varchar(255)
);
CREATE INDEX idx_circuitos_seccion ON circuitos(seccion_id);

CREATE TABLE escuelas (
    id serial PRIMARY KEY,
    circuito_id integer,
    escuela_id varchar(40),
    escuela varchar(255) NOT NULL
);
CREATE INDEX idx_escuelas_circuito ON escuelas(circuito_id);

CREATE TABLE mesas (
    id serial PRIMARY KEY,
    escuela_id integer,
    identificador_unico_mesa varchar(40),
    mesa_id varchar(10),
    activo boolean DEFAULT false
);
CREATE INDEX idx_mesas_escuela ON mesas(escuela_id);
CREATE INDEX idx_mesas_identificador_unico_mesa ON mesas(identificador_unico_mesa);

/*
CREATE TABLE usuarios (
    id serial primary key,
    email varchar(255) unique,
    rol integer,
    fecha_creacion timestamp default current_timestamp
);

CREATE TABLE usuarios_mesas (
    id serial primary key,
    usuario_id integer,
    mesa_id integer
);

CREATE UNIQUE INDEX idx_usuarios_mesas_usuario_mesa ON usuarios_mesas(usuario_id, mesa_id);
*/

CREATE TABLE telegramas (
    id serial PRIMARY KEY,
    mesa_id integer NOT NULL UNIQUE,
    link VARCHAR(255) NOT NULL
);

CREATE INDEX idx_telegramas_mesa ON telegramas(mesa_id);

CREATE TABLE resultados (
    id serial PRIMARY KEY,
    mesa_id integer NOT NULL UNIQUE,
    fiscal_lla integer,
    fiscal_uxp integer,
    fiscal_blanco integer,
    fiscal_comando integer,
    fiscal_impugnado integer,
    fiscal_nulo integer,
    fiscal_recurrido integer,
    api_lla integer,
    api_uxp integer,
    api_blanco integer,
    api_comando integer,
    api_impugnado integer,
    api_nulo integer,
    api_recurrido integer,
    ocr_lla integer,
    ocr_uxp integer,
    ocr_blanco integer,
    ocr_comando integer,
    ocr_impugnado integer,
    ocr_nulo integer,
    ocr_recurrido integer
);

\COPY provincias FROM '/docker-entrypoint-initdb.d/provincias.csv' DELIMITER ',' CSV HEADER;
\COPY seccionprovinciales FROM '/docker-entrypoint-initdb.d/seccionprovinciales.csv' DELIMITER ',' CSV HEADER;
\COPY secciones FROM '/docker-entrypoint-initdb.d/secciones.csv' DELIMITER ',' CSV HEADER;
\COPY circuitos FROM '/docker-entrypoint-initdb.d/circuitos.csv' DELIMITER ',' CSV HEADER;
\COPY escuelas FROM '/docker-entrypoint-initdb.d/escuelas.csv' DELIMITER ',' CSV HEADER;
\COPY mesas FROM '/docker-entrypoint-initdb.d/mesas.csv' DELIMITER ',' CSV HEADER;
