ALTER TABLE shareoption ADD COLUMN key VARCHAR(50);
ALTER TABLE shareoption ADD COLUMN information TEXT;
ALTER TABLE shareoption ADD COLUMN image BYTEA;

UPDATE shareoption SET key = 'size' WHERE name = 'Share size';
UPDATE shareoption SET key = 'bread' WHERE name = 'Bread shares';
UPDATE shareoption SET key = 'greens' WHERE name = 'Extra greens';

UPDATE shareoption SET information = 'Extra Greens will vary each week and could be any of the following: lettuce, spinach, kale, chard, green cabbage, pac choi, Chinese cabbage, tat soi, arugula, or mustards' WHERE key = 'greens';
UPDATE shareoption SET information = 'The bread that we offer is made by our friends at The Maker’s Meadow. Their bread is baked with whole wheat flour that they soak and grind themselves. The loaves will rotate each week between a standard loaf, speciality loaf, and pizza bread.' WHERE key = 'bread';
