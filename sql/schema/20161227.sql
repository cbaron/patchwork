CREATE TABLE producefamily (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(200)
);

CREATE TABLE produce (
    id              SERIAL PRIMARY KEY,
    producefamilyid INTEGER REFERENCES producefamily (id),
    name            VARCHAR(200)
);

CREATE TABLE memberfoodomission (
    id              SERIAL PRIMARY KEY,
    memberid        INTEGER REFERENCES member (id),
    produceid       INTEGER REFERENCES produce (id),
    producefamilyid INTEGER REFERENCES producefamily (id)
);

INSERT INTO producefamily ( name ) VALUES ('Mustards');
INSERT INTO producefamily ( name ) VALUES ('Kale');
INSERT INTO producefamily ( name ) VALUES ('Pac Choi');
INSERT INTO producefamily ( name ) VALUES ('Cabbage');
INSERT INTO producefamily ( name ) VALUES ('Radishes');
INSERT INTO producefamily ( name ) VALUES ('Turnips');
INSERT INTO producefamily ( name ) VALUES ('Potatoes');
INSERT INTO producefamily ( name ) VALUES ('Onions');
INSERT INTO producefamily ( name ) VALUES ('Garlic');
INSERT INTO producefamily ( name ) VALUES ('Tomatoes');
INSERT INTO producefamily ( name ) VALUES ('Peppers');
INSERT INTO producefamily ( name ) VALUES ('Summer Squash');

INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Lettuce', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Green mustard',  ( SELECT id FROM producefamily WHERE name = 'Mustards' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Arugula',  ( SELECT id FROM producefamily WHERE name = 'Mustards' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'TatSoi',  ( SELECT id FROM producefamily WHERE name = 'Mustards' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Spinach', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Curly kale',  ( SELECT id FROM producefamily WHERE name = 'Kale' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Siberian kale',  ( SELECT id FROM producefamily WHERE name = 'Kale' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Lacinato kale',  ( SELECT id FROM producefamily WHERE name = 'Kale' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Chard', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Green pac choi',  ( SELECT id FROM producefamily WHERE name = 'Pac Choi' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Red pac choi',  ( SELECT id FROM producefamily WHERE name = 'Pac Choi' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Chinese cabbage',  ( SELECT id FROM producefamily WHERE name = 'Cabbage' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Green cabbage',  ( SELECT id FROM producefamily WHERE name = 'Cabbage' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Red cabbage',  ( SELECT id FROM producefamily WHERE name = 'Cabbage' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Broccoli', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Cauliflower', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Brussels sprouts', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Kohlrabi', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Red radishes',  ( SELECT id FROM producefamily WHERE name = 'Radishes' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Watermelon radishes',  ( SELECT id FROM producefamily WHERE name = 'Radishes' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Daikon radishes',  ( SELECT id FROM producefamily WHERE name = 'Radishes' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Purple top turnips',  ( SELECT id FROM producefamily WHERE name = 'Turnips' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Scarlet top turnips',  ( SELECT id FROM producefamily WHERE name = 'Turnips' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Hakurei turnips',  ( SELECT id FROM producefamily WHERE name = 'Turnips' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Red beets', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Carrots', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Red potatoes',  ( SELECT id FROM producefamily WHERE name = 'Potatoes' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'White potatoes',  ( SELECT id FROM producefamily WHERE name = 'Potatoes' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Yukon potatoes',  ( SELECT id FROM producefamily WHERE name = 'Potatoes' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Sweet potatoes', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Green onions',  ( SELECT id FROM producefamily WHERE name = 'Onions' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Shallots',  ( SELECT id FROM producefamily WHERE name = 'Onions' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Dry onions',  ( SELECT id FROM producefamily WHERE name = 'Onions' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Leeks',  ( SELECT id FROM producefamily WHERE name = 'Onions' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Garlic',  ( SELECT id FROM producefamily WHERE name = 'Garlic' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Garlic scapes',  ( SELECT id FROM producefamily WHERE name = 'Garlic' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Red tomatoes',  ( SELECT id FROM producefamily WHERE name = 'Tomatoes' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Heirloom tomatoes',  ( SELECT id FROM producefamily WHERE name = 'Tomatoes' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Cherry tomatoes',  ( SELECT id FROM producefamily WHERE name = 'Tomatoes' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Eggplant', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Sweet peppers',  ( SELECT id FROM producefamily WHERE name = 'Peppers' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Hot peppers',  ( SELECT id FROM producefamily WHERE name = 'Peppers' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Peas', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Beans', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Okra', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Corn', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Zucchini',  ( SELECT id FROM producefamily WHERE name = 'Summer Squash' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Yellow squash',  ( SELECT id FROM producefamily WHERE name = 'Summer Squash' ) );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Cucumbers', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Acorn Squash', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Butternut Squash', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Pumpkin pie', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Spaghetti squash', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Basil', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Celeriac', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Celery', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Cilantro', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Dill', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Fennel', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Parsley', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Rosemary', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Sage', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Flowers', NULL );
INSERT INTO produce ( name, producefamilyid ) VALUES ( 'Strawberries', NULL );
