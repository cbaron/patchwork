CREATE TABLE membership (
   id           SERIAL PRIMARY KEY,
   personid     INTEGER REFERENCES person (id),
   roleid       INTEGER REFERENCES role (id)
);
