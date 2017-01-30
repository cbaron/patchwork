ALTER TABLE shareoption ADD COLUMN key VARCHAR(50);
ALTER TABLE shareoption ADD COLUMN information TEXT;

UPDATE shareoption SET key = 'size' WHERE name = 'Share size';
UPDATE shareoption SET key = 'bread' WHERE name = 'Bread shares';
UPDATE shareoption SET key = 'greens' WHERE name = 'Extra greens';
