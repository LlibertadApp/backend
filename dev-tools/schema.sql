CREATE TABLE provincias (
    id integer primary key,
    provincia_nombre varchar(255) not null
);

CREATE TABLE seccionprovinciales (
    id integer,
    provincia_id integer,
    seccionprovincial_nombre varchar(255) not null,
    PRIMARY KEY (id, provincia_id)
);

CREATE TABLE secciones (
    id integer,
    provincia_id integer,
    seccionprovincial_id integer,
    seccion_nombre varchar(255) not null,
    PRIMARY KEY (id, seccionprovincial_id, provincia_id)
);

CREATE TABLE circuitos (
    circuito_id varchar(10),
    seccion_id integer,
    circuito_nombre varchar(255) not null,
    PRIMARY KEY (circuito_id, seccion_id)
);

CREATE TABLE mesas (
    id varchar(40) primary key,
    mesa_id varchar(10),
    circuito_id varchar(10),
    mesa_tipo varchar(50) not null,
    activo boolean default false
);

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

CREATE TABLE telegramas (
    id serial PRIMARY KEY,
    mesa_id integer NOT NULL,
    usuario_id integer NOT NULL,
    link VARCHAR(255) NOT NULL,
    notas VARCHAR(255)
);

CREATE INDEX idx_telegramas_mesa ON telegramas(mesa_id);
CREATE INDEX idx_telegramas_usuario ON telegramas(usuario_id);

CREATE TABLE resultados (
    id serial PRIMARY KEY,
    mesa_id varchar(40),
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
\COPY mesas FROM '/docker-entrypoint-initdb.d/mesas.csv' DELIMITER ',' CSV HEADER;
