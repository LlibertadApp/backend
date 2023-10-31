CREATE TABLE provincias (
    id serial primary key,
    uuid integer,
    provincia_nombre varchar(255) not null
);
CREATE INDEX idx_provincia_uuid ON provincias(uuid);

CREATE TABLE seccionprovinciales (
    id serial primary key,
    uuid integer,
    provincia_id integer,
    seccionprovincial_nombre varchar(255) not null
);
CREATE INDEX idx_seccionprovincial_uuid ON seccionprovinciales(uuid);

CREATE TABLE secciones (
    id serial primary key,
    uuid integer,
    seccionprovincial_id integer DEFAULT NULL,
    provincia_id integer DEFAULT NULL,
    seccion_nombre varchar(255) not null,
    CHECK ((seccionprovincial_id IS NOT NULL AND provincia_id IS NULL) OR (seccionprovincial_id IS NULL AND provincia_id IS NOT NULL))
);
CREATE INDEX idx_seccion_uuid ON secciones(uuid);

CREATE TABLE circuitos (
    id serial primary key,
    uuid integer,
    seccion_id integer,
    circuito_nombre varchar(255) not null
);
CREATE INDEX idx_circuito_uuid ON circuitos(uuid);

CREATE TABLE mesas (
    id serial primary key,
    uuid integer,
    circuito_id integer,
    mesa_tipo varchar(50) not null
);
CREATE INDEX idx_mesa_uuid ON mesas(uuid);

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