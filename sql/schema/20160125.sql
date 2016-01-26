DROP TABLE season;

ALTER TABLE share ADD COLUMN name VARCHAR(20);
ALTER TABLE share ADD COLUMN label VARCHAR(40);

UPDATE tablemeta set recorddescriptor = 'personid' where name = 'member';
UPDATE tablemeta set recorddescriptor = 'label' where name = 'share';
