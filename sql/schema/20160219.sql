ALTER TABLE sharegroupdropoff ADD COLUMN starttime TIME WITH TIME ZONE;
ALTER TABLE sharegroupdropoff ADD COLUMN endtime TIME WITH TIME ZONE;

UPDATE sharegroupdropoff SET starttime = '2:00:00', endtime = '8:00:00';

ALTER TABLE share ADD COLUMN description TEXT;
