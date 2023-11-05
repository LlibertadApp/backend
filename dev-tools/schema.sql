CREATE TABLE provincias (
    id SERIAL PRIMARY KEY,
    provincia_id INTEGER,
    provincia_nombre VARCHAR(255) NOT NULL
);

CREATE TABLE seccionprovinciales (
    id SERIAL PRIMARY KEY,
    provincia_id INTEGER,
    seccionprovincial_id INTEGER,
    seccionprovincial_nombre VARCHAR(255)
);
CREATE INDEX idx_seccionprovinciales_provincia ON seccionprovinciales(provincia_id);

CREATE TABLE secciones (
    id SERIAL PRIMARY KEY,
    seccionprovincial_id INTEGER,
    seccion_id INTEGER,
    seccion_nombre VARCHAR(255) NOT NULL
);
CREATE INDEX idx_secciones_seccionprovincial ON secciones(seccionprovincial_id);

CREATE TABLE circuitos (
    id SERIAL PRIMARY KEY,
    seccion_id INTEGER,
    circuito_id VARCHAR(10),
    circuito_nombre VARCHAR(255)
);
CREATE INDEX idx_circuitos_seccion ON circuitos(seccion_id);

CREATE TABLE escuelas (
    id SERIAL PRIMARY KEY,
    circuito_id INTEGER,
    escuela_id VARCHAR(40),
    escuela VARCHAR(255) NOT NULL
);
CREATE INDEX idx_escuelas_circuito ON escuelas(circuito_id);

CREATE TABLE mesas (
    id SERIAL PRIMARY KEY,
    escuela_id INTEGER,
    identificador_unico_mesa VARCHAR(40),
    mesa_id VARCHAR(10),
    activo boolean DEFAULT false
);
CREATE INDEX idx_mesas_escuela ON mesas(escuela_id);
CREATE INDEX idx_mesas_identificador_unico_mesa ON mesas(identificador_unico_mesa);

CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    rol_id INTEGER,
    rol_nombre VARCHAR(255),
);

CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    email VARCHAR(255) UNIQUE,
    rol_id INTEGER NOT NULL,
    fecha_creacion timestamp default current_timestamp
);
CREATE INDEX idx_usuarios_rol_id ON usuarios(rol_id);


CREATE TABLE usuarios_mesas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    mesa_id INTEGER NOT NULL,
    rol_id VARCHAR(255) NOT NULL
    CHECK (rol_id = 2)
);
CREATE INDEX idx_usuarios_mesas_usuario ON usuarios_mesas(usuario_id);
CREATE INDEX idx_usuarios_mesas_mesa ON usuarios_mesas(mesa_id);
CREATE INDEX idx_usuarios_mesas_rol_id ON usuarios_mesas(rol_id);

CREATE TABLE usuarios_escuelas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    escuela_id INTEGER NOT NULL,
    rol_id INTEGER NOT NULL
    CHECK (rol_id = 3)
);
CREATE INDEX idx_usuarios_escuelas_usuario ON usuarios_escuelas(usuario_id);
CREATE INDEX idx_usuarios_escuelas_escuela ON usuarios_escuelas(escuela_id);
CREATE INDEX idx_usuarios_escuelas_rol_id ON usuarios_escuelas(rol_id);

CREATE TABLE telegramas (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER NOT NULL UNIQUE,
    link VARCHAR(255) NOT NULL
);

CREATE INDEX idx_telegramas_mesa ON telegramas(mesa_id);

CREATE TABLE resultados (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER NOT NULL UNIQUE,
    fiscal_lla INTEGER,
    fiscal_uxp INTEGER,
    fiscal_blanco INTEGER,
    fiscal_comando INTEGER,
    fiscal_impugnado INTEGER,
    fiscal_nulo INTEGER,
    fiscal_recurrido INTEGER,
    api_lla INTEGER,
    api_uxp INTEGER,
    api_blanco INTEGER,
    api_comando INTEGER,
    api_impugnado INTEGER,
    api_nulo INTEGER,
    api_recurrido INTEGER,
    ocr_lla INTEGER,
    ocr_uxp INTEGER,
    ocr_blanco INTEGER,
    ocr_comando INTEGER,
    ocr_impugnado INTEGER,
    ocr_nulo INTEGER,
    ocr_recurrido INTEGER
);

\COPY provincias FROM '/docker-entrypoint-initdb.d/provincias.csv' DELIMITER ',' CSV HEADER;
\COPY seccionprovinciales FROM '/docker-entrypoint-initdb.d/seccionprovinciales.csv' DELIMITER ',' CSV HEADER;
\COPY secciones FROM '/docker-entrypoint-initdb.d/secciones.csv' DELIMITER ',' CSV HEADER;
\COPY circuitos FROM '/docker-entrypoint-initdb.d/circuitos.csv' DELIMITER ',' CSV HEADER;
\COPY escuelas FROM '/docker-entrypoint-initdb.d/escuelas.csv' DELIMITER ',' CSV HEADER;
\COPY mesas FROM '/docker-entrypoint-initdb.d/mesas.csv' DELIMITER ',' CSV HEADER;
