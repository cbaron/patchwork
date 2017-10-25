ALTER TABLE farmermarket RENAME COLUMN citystatezip TO "cityStateZip";
ALTER TABLE retailoutlet RENAME COLUMN citystatezip TO "cityStateZip";

ALTER TABLE contactinfo RENAME COLUMN citystatezip TO "cityStateZip";
ALTER TABLE contactinfo ADD COLUMN name VARCHAR(100);
UPDATE contactinfo SET name = 'Patchwork Gardens', street = '9057 W Third St' WHERE street = '9057 W. Third St.';

ALTER TABLE restaurant DROP COLUMN address;
ALTER TABLE restaurant ADD COLUMN street VARCHAR(100);
ALTER TABLE restaurant ADD COLUMN "cityStateZip" VARCHAR(100);

UPDATE restaurant SET name = 'Antioch College Dining Halls', street = '1 Morgan Place', "cityStateZip" = 'Yellow Springs, OH 45387', phonenumber = '(937) 767-1286' WHERE name = 'Antioch College';
UPDATE restaurant SET street = '613 E 5th St', "cityStateZip" = 'Dayton, OH 45403', phonenumber = '(937) 719-0999' WHERE name = 'Corner Kitchen';
UPDATE restaurant SET street = '329 E 5th St.', "cityStateZip" = 'Dayton, OH 45402', phonenumber = '(937) 723-7637' WHERE name = 'Lily''s Bistro';
UPDATE restaurant SET street = '520 E 5th St', "cityStateZip" = 'Dayton, OH 45402', phonenumber = '(937) 222-6800', name = 'Lucky''s Taproom and Eatery' WHERE url = 'http://www.luckystaproom.com';
UPDATE restaurant SET street = '5531 Far Hills Ave', "cityStateZip" = 'Dayton, OH 45429', phonenumber = '(937) 434-4750' WHERE name = 'The Meadowlark Restaurant';
UPDATE restaurant SET street = '1061 Miamisburg Centerville Rd', "cityStateZip" = 'Dayton, OH 45459', phonenumber = '(937) 610-1061' WHERE name = 'Rue Dumaine Restaurant';
UPDATE restaurant SET street = '259 Xenia Ave', "cityStateZip" = 'Yellow Springs, OH 45387', phonenumber = '(937) 767-7211' WHERE name = 'Sunrise Cafe';
UPDATE restaurant SET street = '515 Wayne Ave', "cityStateZip" = 'Dayton, OH 45410', phonenumber = '(937) 496-5268' WHERE name = 'Wheat Penny Oven and Bar';
UPDATE restaurant SET street = '215 Xenia Ave', "cityStateZip" = 'Yellow Springs, OH 45387', phonenumber = '(937) 767-1144' WHERE name = 'Winds Cafe';
UPDATE restaurant SET street = '28 S Limestone St', "cityStateZip" = 'Springfield, OH 45502', phonenumber = '(937) 521-1200' WHERE name = 'Seasons Bistro and Grille';

ALTER TABLE groupdropoff RENAME COLUMN address TO street;
ALTER TABLE groupdropoff ADD COLUMN venue VARCHAR(100);

UPDATE groupdropoff SET label = 'Beavercreek Group' WHERE name = 'Beavercreek Group';
UPDATE groupdropoff SET label = 'Kettering Group' WHERE name = 'Kettering Group';
UPDATE groupdropoff SET venue = 'Dayton Strength and Conditioning' WHERE name = 'Beavercreek Group';
UPDATE groupdropoff SET venue = 'Center for Spiritual Living Greater Dayton' WHERE name = 'Kettering Group';
UPDATE groupdropoff SET label = 'EAT Food for Life Group', venue = 'EAT Food for Life Farm House' WHERE name = 'EAT Food for Life Group';