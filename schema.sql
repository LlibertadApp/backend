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
    seccionprovincial_id integer,
    seccion_nombre varchar(255) not null,
    PRIMARY KEY (id, seccionprovincial_id)
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
    mesa_tipo varchar(50) not null
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

\COPY provincias FROM 'provincias.csv' DELIMITER ',' CSV HEADER;
\COPY seccionprovinciales FROM 'seccionprovinciales.csv' DELIMITER ',' CSV HEADER;
\COPY secciones FROM 'secciones.csv' DELIMITER ',' CSV HEADER;
\COPY circuitos FROM 'circuitos.csv' DELIMITER ',' CSV HEADER;
\COPY mesas FROM 'mesas.csv' DELIMITER ',' CSV HEADER;
