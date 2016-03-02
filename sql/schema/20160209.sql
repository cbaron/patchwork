ALTER TABLE sharegroupdropoff DROP COLUMN shareid;
ALTER TABLE sharegroupdropoff ADD COLUMN shareid INTEGER REFERENCES share (id);

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'groupdropoff', 'Group Drop-Off', 'Each record represents a location utilized as a share''s dropoff location', 'label' );
