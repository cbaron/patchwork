CREATE TABLE "smallShareExample" (
    id          SERIAL PRIMARY KEY,
    content     VARCHAR(100),
    position    INTEGER
);

INSERT INTO "smallShareExample" ( content, position ) VALUES ( '1 head of lettuce', '1' );
INSERT INTO "smallShareExample" ( content, position ) VALUES ( '1 lb sweet peppers', '2' );
INSERT INTO "smallShareExample" ( content, position ) VALUES ( '3/4 lb tomatoes', '3' );
INSERT INTO "smallShareExample" ( content, position ) VALUES ( '1/2 lb beans', '4' );
INSERT INTO "smallShareExample" ( content, position ) VALUES ( '3/4 lb summer squash', '5' );
INSERT INTO "smallShareExample" ( content, position ) VALUES ( '1 lb potatoes', '6' );
INSERT INTO "smallShareExample" ( content, position ) VALUES ( '1 lb green cabbage', '7' );
INSERT INTO "smallShareExample" ( content, position ) VALUES ( '2 ears of corn', '8' );