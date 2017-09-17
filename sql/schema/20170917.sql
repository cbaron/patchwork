ALTER TABLE groupdropoff ADD COLUMN "cityStateZip" VARCHAR(100);

UPDATE groupdropoff SET "cityStateZip" = 'Yellow Springs, OH 45387' WHERE name = 'Yellow Springs Group';
UPDATE groupdropoff SET "cityStateZip" = 'Dayton, OH 45405' WHERE name = 'McPherson Town Group';
UPDATE groupdropoff SET "cityStateZip" = 'Dayton, OH 45432' WHERE name = 'Beavercreek Group';
UPDATE groupdropoff SET "cityStateZip" = 'Dayton, OH 45429' WHERE name = 'Kettering Group';
UPDATE groupdropoff SET "cityStateZip" = 'Dayton, OH 45410' WHERE name = 'EAT Food for Life Group';