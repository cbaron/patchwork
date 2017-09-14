CREATE EXTENSION postgis; CREATE EXTENSION postgis_topology;

ALTER TABLE farmermarket ADD COLUMN location GEOGRAPHY(POINT,4326);
ALTER TABLE retailoutlet ADD COLUMN location GEOGRAPHY(POINT,4326);
ALTER TABLE restaurant ADD COLUMN location GEOGRAPHY(POINT,4326);
ALTER TABLE groupdropoff ADD COLUMN location GEOGRAPHY(POINT,4326);
ALTER TABLE contactinfo ADD COLUMN location GEOGRAPHY(POINT,4326);

UPDATE farmermarket SET location = ST_MakePoint( 39.807006, -83.889678 ) WHERE name = 'Yellow Springs Saturday Market';

UPDATE retailoutlet SET location = ST_MakePoint( 39.687871, -84.164494 ) WHERE name = 'Olympia Health Food Store';
UPDATE retailoutlet SET location = ST_MakePoint( 39.750956, -84.175180 ) WHERE name = 'E.A.T. Food for Life';

UPDATE restaurant SET location = ST_MakePoint( 39.757270, -84.182513 ) WHERE name = 'Corner Kitchen';
UPDATE restaurant SET location = ST_MakePoint( 39.757459, -84.185738 ) WHERE name = 'Lily''s Bistro';
UPDATE restaurant SET location = ST_MakePoint( 39.666058, -84.162889 ) WHERE name = 'The Meadowlark Restaurant';
UPDATE restaurant SET location = ST_MakePoint( 39.629055, -84.189523 ) WHERE name = 'Rue Dumaine Restaurant';
UPDATE restaurant SET location = ST_MakePoint( 39.804702, -83.889275 ) WHERE name = 'Sunrise Cafe';
UPDATE restaurant SET location = ST_MakePoint( 39.755119, -84.180449 ) WHERE name = 'Wheat Penny Oven and Bar';
UPDATE restaurant SET location = ST_MakePoint( 39.805933, -83.888410 ) WHERE name = 'Winds Cafe';
UPDATE restaurant SET location = ST_MakePoint( 39.923871, -83.808407 ) WHERE name = 'Seasons Bistro and Grille';
UPDATE restaurant SET location = ST_MakePoint( 39.756932, -84.182981 ), street = '520 E 5th St', "cityStateZip" = 'Dayton, OH 45402' WHERE name = 'Lucky''s Taproom and Eatery';
UPDATE restaurant SET location = ST_MakePoint( 39.799335, -83.887719 ) WHERE name = 'Antioch College Dining Halls';

UPDATE groupdropoff SET location = ST_MakePoint( 39.802585, -83.888113 ) WHERE name = 'Yellow Springs Group';
UPDATE groupdropoff SET location = ST_MakePoint( 39.767211, -84.197318 ) WHERE name = 'McPherson Town Group';
UPDATE groupdropoff SET location = ST_MakePoint( 39.729093, -84.069067 ) WHERE name = 'Beavercreek Group';
UPDATE groupdropoff SET location = ST_MakePoint( 39.687141, -84.146484 ) WHERE name = 'Kettering Group';
UPDATE groupdropoff SET location = ST_MakePoint( 39.750956, -84.175180 ) WHERE name = 'EAT Food for Life Group';

UPDATE contactinfo SET location = ST_MakePoint( 39.746509, -84.347601 ) WHERE name = 'Patchwork Gardens';