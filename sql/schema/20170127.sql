DROP TABLE csapageimage;

DELETE FROM tablemeta WHERE name = 'csapageimage';

CREATE TABLE csadeliveryinfo (
    id                  SERIAL PRIMARY KEY,
    homedeliveryintro   TEXT,
    deliveryrange       TEXT,
    groupdeliveryintro  TEXT
);

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'csadeliveryinfo', 'CSA Delivery Info', 'Data to be displayed on the /csa page.  One record only.', null );

ALTER TABLE csadeliveryinfo DROP COLUMN deliveryrange;
ALTER TABLE csadeliveryinfo ADD COLUMN deliveryrange bytea;

ALTER TABLE csadeliveryinfo RENAME TO csainfo;
ALTER TABLE csainfo ADD COLUMN payment TEXT;

UPDATE tablemeta SET name = 'csainfo' WHERE name = 'csadeliveryinfo';
UPDATE tablemeta SET label = 'CSA Info' WHERE name = 'csainfo';

ALTER TABLE contactinfo ADD COLUMN farmpickup TEXT;

UPDATE contactinfo SET farmpickup = '41 N. Lutheran Church Rd., Dayton, OH 45417';

INSERT INTO csainfo ( homedeliveryintro, groupdeliveryintro, payment ) VALUES ( 'Patchwork Gardens is happy to offer Home Delivery for $1.50 / per box. We encourage anyone living within our current delivery range (see map below) to consider this option. Having your box delivered to your home ensures that your box is on your doorstep each week waiting for you! All you have to do is set out your empty box from the previous week.', 'For those interested in picking up at a Group Location (no additional fee for this service), then we offer the following options:', 'Our standard process is to receive payment in full for the season that you will receive a box prior to the start of that season. For those who sign-up using our online form, you will have the opportunity to pay with a credit card at the end of the sign-up. Otherwise, members may send a check (made payable to Patchwork Gardens) to Patchwork Gardens at 9057 W. 3rd St, Dayton, OH 45417. If you are in need of a Payment Plan option, then please contact us directly to learn more about this option.' );
