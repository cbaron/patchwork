DELETE FROM tablemeta WHERE name IN ( 'season', 'internshipcompensation' );

INSERT INTO tablemeta ( name, label, description ) VALUES ( 'seasonalAddOn', 'Seasonal Add-On', 'Each record describes a seasonal item for sale.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'seasonalAddOnOption', 'Seasonal Add-On Option', 'Each record describes a purchase option (amount and price) for a seasonal item.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'memberShareSeasonalAddOn', 'Member Share Seasonal Add On', 'Each record documents the purchase of a seasonal item for a particular share.' );