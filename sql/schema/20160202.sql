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
