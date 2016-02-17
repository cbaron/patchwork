ALTER TABLE membershareoption DROP COLUMN shareoptionsshareid;

ALTER TABLE membershareoption ADD COLUMN shareoptionid INTEGER REFERENCES shareoption(id);
ALTER TABLE membershareoption ADD COLUMN shareoptionoptionid INTEGER REFERENCES shareoptionoption(id);

CREATE TABLE membersharedelivery (
    id                 SERIAL PRIMARY KEY,
    shareid            INTEGER REFERENCES share (id),
    deliveryoptionid   INTEGER REFERENCES deliveryoption (id),
    groupdropoffid     INTEGER REFERENCES groupdropoff (id)
);
