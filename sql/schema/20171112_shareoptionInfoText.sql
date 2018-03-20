UPDATE shareoption SET information = 'Extra Greens will vary each week. Examples include lettuce, spinach, kale, chard, green cabbage, pac choi, Chinese cabbage, tat soi, arugula, or mustards.' WHERE name = 'Extra greens';

UPDATE shareoption SET information = 'Courtesy of our good friends at {{The Maker''s Meadow:https://www.facebook.com/themakersmeadow}}! Their bread is baked with whole wheat flour that they soak and grind themselves. Loaves rotate weekly. Enjoy standard, specialty or pizza bread.' WHERE name = 'Bread shares';

ALTER TABLE shareoption DROP COLUMN image;