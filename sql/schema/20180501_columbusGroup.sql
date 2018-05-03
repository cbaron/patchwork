ALTER TABLE groupdropoff ADD COLUMN price MONEY;

UPDATE groupdropoff SET price = '$0.00';

INSERT INTO groupdropoff ( name, label, street, location, "cityStateZip", price ) VALUES ( 'Columbus Group', 'Columbus Group', '162 Aldrich Rd', ST_MakePoint( 40.050736, -83.0267051 ), 'Columbus, OH 43214', '$1.50' );

INSERT INTO sharegroupdropoff( groupdropoffid, dayofweek, shareid, starttime, endtime ) VALUES ( (SELECT id FROM groupdropoff WHERE label = 'Columbus Group'), '5', (SELECT id FROM share WHERE name = '2018-spring'), '16:00', '20:00');
INSERT INTO sharegroupdropoff( groupdropoffid, dayofweek, shareid, starttime, endtime ) VALUES ( (SELECT id FROM groupdropoff WHERE label = 'Columbus Group'), '5', (SELECT id FROM share WHERE name = '2018-summer'), '16:00', '20:00');

INSERT INTO deliveryroute ( label, dayofweek, starttime, endtime ) VALUES ( 'Columbus', '5', '16:00', '20:00' );

INSERT INTO zipcoderoute ( zipcode, routeid ) VALUES ( '43214', ( SELECT id FROM deliveryroute WHERE label = 'Columbus' ) );