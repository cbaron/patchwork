ALTER TABLE tablemeta ALTER COLUMN label TYPE VARCHAR(40);
ALTER TABLE tablemeta ALTER COLUMN description TYPE TEXT;

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'carousel', 'Carousel', 'Contains images for the home page''s "carousel".  It is suggested to use images with a size of 2000x1500 (w/h).', 'filename' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'contactinfo', 'Contact Info', 'A single record containing contact info to be displayed on the contact page.', 'street' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'csapageimage', 'CSA Page Image', 'A single record containing the image / caption for the CSA page.', 'caption' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'csastatements', 'CSA Statements', 'Each record is a statement to be displayed on the CSA page under the "how do I know.." heading.', NULL );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'deliveryroute', 'Delivery Routes', 'Each record references a delivery route: day of week, start/end times.', 'label' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'farmermarket', 'Farmer''s Markets', 'Each record references a farmer''s market on the /market page.', 'name' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'header', 'Header Stylings', 'Each record references a page, the image background for desktop/mobile, the header text color and hover color.  It is suggested to use 2400x950 sized images for desktop, and 1400x1200 for mobile (w/h).', 'page' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'internshipcompensation', 'Internship Compensation', 'Each record references an item under internship compensation.', NULL );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'internshipduty', 'Internship Duties', 'Each record references an item under internship duties.', NULL );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'internshipqualification', 'Internship Qualifications', 'Each record references an item under internship quaifications.', NULL );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'largeshareexample', 'Large Share Example', 'Each record references an item on the CSA page detailing an example large share.', NULL );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'membersharedelivery', 'Member Share Delivery', 'Each record references a member''s delivery selection for a particular share.', NULL );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'membershareskipweek', 'Member Share Skip Week', 'Each record references a member''s dates where they do not plan on picking up their share.', NULL );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'restaurant', 'Restaurants', 'Each record references a restaurant on the /markets page.', 'name' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'retailoutlet', 'Retail Outlets', 'Each record references a retail outlet on the /markets page.', 'name' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'sharedeliveryoption', 'Share Delivery Options', 'Each record associates a delivery option with a share.', NULL );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'staffprofile', 'Staff Profiles', 'Each record represents a staff member to be displayed on the /about page.', 'name' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'zipcoderoute', 'Zip Code => Route', 'Each record associates a zip code with a delivery route.', 'zipcode' );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'sharegroupdropoff', 'Share Group Drop-offs', 'Each record associates a group drop off with a share.', NULL );

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'shareoptionoption', 'ShareOption Options', 'Each record is an option ( large/small, 0/1/2 ) for a particular "shareoption" ( size, extra greens, bread ).', NULL );
