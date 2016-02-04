CREATE TABLE csastatements (
    id             SERIAL PRIMARY KEY,
    text           VARCHAR(100)
);

CREATE TABLE largeshareexamplecolumnone (
    id             SERIAL PRIMARY KEY,
    text           VARCHAR(100)
);

CREATE TABLE largeshareexamplecolumntwo (
    id             SERIAL PRIMARY KEY,
    text           VARCHAR(100)
);

CREATE TABLE csapageimage (
    id             SERIAL PRIMARY KEY,
    path           VARCHAR(100),
    extension      VARCHAR(10),
    caption        VARCHAR(100),
    description    VARCHAR(1000)
);