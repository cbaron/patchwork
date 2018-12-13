ALTER TABLE "seasonalAddOnOption" ADD COLUMN position INTEGER;

ALTER TABLE "seasonalAddOn" ADD COLUMN images VARCHAR(100) ARRAY;

UPDATE "seasonalAddOn" SET images='{pw_shirt_ginger.jpg, pw_shirt_maroon.jpg}' WHERE name = 'shirt 1';
UPDATE "seasonalAddOn" SET images='{pw_shirt_ginger.jpg, pw_shirt_maroon.jpg}' WHERE name = 'shirt 2';