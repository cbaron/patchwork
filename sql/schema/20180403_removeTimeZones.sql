UPDATE deliveryroute SET starttime = '11:00:00' WHERE starttime = '13:00:00-05';
UPDATE deliveryroute SET starttime = '13:00:00' WHERE starttime = '15:00:00-05';
UPDATE deliveryroute SET starttime = '12:00:00' WHERE starttime = '15:00:00-04';

UPDATE deliveryroute SET endtime = '17:00:00' WHERE endtime = '19:00:00-05';
UPDATE deliveryroute SET endtime = '16:00:00' WHERE endtime = '18:00:00-05';
UPDATE deliveryroute SET endtime = '16:00:00' WHERE endtime = '19:00:00-04';

ALTER TABLE deliveryroute ALTER COLUMN starttime SET DATA TYPE TIME WITHOUT TIME ZONE;
ALTER TABLE deliveryroute ALTER COLUMN endtime SET DATA TYPE TIME WITHOUT TIME ZONE;


UPDATE sharegroupdropoff SET starttime = '12:00:00' WHERE starttime = '15:00:00-04';
UPDATE sharegroupdropoff SET starttime = '13:00:00' WHERE starttime = '15:00:00-05';
UPDATE sharegroupdropoff SET starttime = '06:30:00' WHERE starttime = '08:30:00-05';
UPDATE sharegroupdropoff SET starttime = '12:00:00' WHERE starttime = '14:00:00-05';
UPDATE sharegroupdropoff SET starttime = '05:30:00' WHERE starttime = '08:30:00-04';
UPDATE sharegroupdropoff SET starttime = '13:00:00' WHERE starttime = '16:00:00-04';
UPDATE sharegroupdropoff SET starttime = '06:30:00' WHERE starttime = '09:30:00-04';
UPDATE sharegroupdropoff SET starttime = '14:30:00' WHERE starttime = '16:30:00-05';
UPDATE sharegroupdropoff SET starttime = '13:30:00' WHERE starttime = '16:30:00-04';

UPDATE sharegroupdropoff SET endtime = '16:00:00' WHERE endtime = '19:00:00-04';
UPDATE sharegroupdropoff SET endtime = '17:00:00' WHERE endtime = '19:00:00-05';
UPDATE sharegroupdropoff SET endtime = '10:00:00' WHERE endtime = '12:00:00-05';
UPDATE sharegroupdropoff SET endtime = '16:00:00' WHERE endtime = '18:00:00-05';
UPDATE sharegroupdropoff SET endtime = '09:00:00' WHERE endtime = '12:00:00-04';
UPDATE sharegroupdropoff SET endtime = '17:00:00' WHERE endtime = '20:00:00-04';
UPDATE sharegroupdropoff SET endtime = '10:00:00' WHERE endtime = '13:00:00-04';
UPDATE sharegroupdropoff SET endtime = '17:30:00' WHERE endtime = '19:30:00-05';
UPDATE sharegroupdropoff SET endtime = '22:00:00' WHERE endtime = '00:00:00-05';
UPDATE sharegroupdropoff SET endtime = '16:30:00' WHERE endtime = '19:30:00-04';

ALTER TABLE sharegroupdropoff ALTER COLUMN starttime SET DATA TYPE TIME WITHOUT TIME ZONE;
ALTER TABLE sharegroupdropoff ALTER COLUMN endtime SET DATA TYPE TIME WITHOUT TIME ZONE;