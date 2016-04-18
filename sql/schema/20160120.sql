ALTER TABLE tablemeta ADD COLUMN recordDescriptor VARCHAR(30);

UPDATE tablemeta SET recordDescriptor = 'name' WHERE name = 'person';
