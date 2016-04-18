ALTER TABLE membersharedelivery ADD COLUMN memberid INTEGER REFERENCES member (id);

ALTER TABLE membershareoption DROP COLUMN memberid;
ALTER TABLE membershareoption DROP COLUMN shareid;

ALTER TABLE membershareoption ADD COLUMN membershareid INTEGER REFERENCES membershare (id);

ALTER TABLE membersharedelivery DROP COLUMN memberid;
ALTER TABLE membersharedelivery DROP COLUMN shareid;

ALTER TABLE membersharedelivery ADD COLUMN membershareid INTEGER REFERENCES membershare (id);

ALTER TABLE memberskipweek RENAME TO membershareskipweek;

ALTER TABLE membershareskipweek DROP COLUMN memberid;
ALTER TABLE membershareskipweek DROP COLUMN shareid;

ALTER TABLE membershareskipweek ADD COLUMN membershareid INTEGER REFERENCES membershare (id);

ALTER TABLE member ADD COLUMN extraaddress TEXT;
