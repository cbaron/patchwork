DROP TABLE csapageimage;

DELETE FROM tablemeta WHERE name = 'csapageimage';

CREATE TABLE csadeliveryinfo (
    id                  SERIAL PRIMARY KEY,
    homedeliveryintro   TEXT,
    deliveryrange       TEXT,
    groupdeliveryintro  TEXT
);

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'csadeliveryinfo', 'CSA Delivery Info', 'Data to be displayed on the /csa page.  One record only.', null );
