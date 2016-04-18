CREATE TABLE farmermarket (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    street         VARCHAR(100),
    citystatezip   VARCHAR(100),
    email          VARCHAR(100),
    phonenumber    VARCHAR(16),
    hours          VARCHAR(100)    
);

CREATE TABLE retailoutlet (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    street         VARCHAR(100),
    citystatezip   VARCHAR(100),
    email          VARCHAR(100),
    phonenumber    VARCHAR(16),
    hours          VARCHAR(100)    
);

CREATE TABLE restaurant (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    url            VARCHAR(100),
    email          VARCHAR(100),
    phonenumber    VARCHAR(16),
    address        VARCHAR(200)
);

ALTER TABLE share ADD COLUMN signupcutoff DATE;

CREATE TABLE shareoptionoption (
    id             SERIAL PRIMARY KEY,
    shareoptionid  INTEGER REFERENCES shareoption (id),
    name           VARCHAR(50),
    label          VARCHAR(50),
    price          MONEY
);

UPDATE tablemeta SET recorddescriptor = 'label' where name = 'shareoption';

ALTER TABLE shareoptionsshare RENAME TO shareoptionshare;

