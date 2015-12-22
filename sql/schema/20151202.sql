CREATE TABLE person (
    id             SERIAL PRIMARY KEY,
    email          VARCHAR(100),
    password       VARCHAR(100),
    name           VARCHAR(100),
    created        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE member DROP COLUMN email, DROP COLUMN name;

ALTER TABLE member ADD COLUMN personid INTEGER REFERENCES person (id);

ALTER TABLE transaction ADD COLUMN created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE role (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    label          VARCHAR(100)
);

CREATE TABLE personrole (
    id             SERIAL PRIMARY KEY,
    personid       INTEGER REFERENCES person (id),
    roleid         INTEGER REFERENCES role (id)
);