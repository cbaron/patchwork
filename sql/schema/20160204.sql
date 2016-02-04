CREATE TABLE contactinfo (
    id             SERIAL PRIMARY KEY,
    street         VARCHAR(100),
    citystatezip   VARCHAR(100),
    email          VARCHAR(100),
    phonenumber    VARCHAR(16)
);

CREATE TABLE staffprofile (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    text           VARCHAR(1000),
    imagepath      VARCHAR(100)
);