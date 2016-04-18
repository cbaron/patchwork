CREATE TABLE csastatements (
    id             SERIAL PRIMARY KEY,
    content        VARCHAR(100)
);

CREATE TABLE largeshareexamplecolumnone (
    id             SERIAL PRIMARY KEY,
    content        VARCHAR(100)
);

CREATE TABLE largeshareexamplecolumntwo (
    id             SERIAL PRIMARY KEY,
    content        VARCHAR(100)
);

CREATE TABLE csapageimage (
    id             SERIAL PRIMARY KEY,
    caption        VARCHAR(100),
    image          bytea
);