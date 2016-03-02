CREATE TABLE contactinfo (
    id             SERIAL PRIMARY KEY,
    street         VARCHAR(100),
    citystatezip   VARCHAR(100),
    email          VARCHAR(100),
    phonenumber    VARCHAR(16)
);

CREATE TABLE staffprofile (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    text           VARCHAR(1000),
    imagepath      VARCHAR(100)
);

CREATE TABLE deliveryoption (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(50),
    label          VARCHAR(50),
    price          MONEY
);

CREATE TABLE sharedeliveryoption (
    id               SERIAL PRIMARY KEY,
    shareid          INTEGER REFERENCES share (id),
    deliveryoptionid INTEGER REFERENCES deliveryoption (id)
);

CREATE TABLE groupdropoff (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(50),
    label          VARCHAR(50),
    address        VARCHAR(150)
);

CREATE TABLE sharegroupdropoff (
    id             SERIAL PRIMARY KEY,
    shareid        INTEGER REFERENCES shareoption (id),
    groupdropoffid INTEGER REFERENCES groupdropoff (id),
    dayofweek      INTEGER
);

CREATE TABLE deliveryroute(
    id             SERIAL PRIMARY KEY,
    label          VARCHAR(50),
    dayofweek      INTEGER,
    starttime      TIME WITH TIME ZONE,
    endtime        TIME WITH TIME ZONE
);

INSERT INTO deliveryroute ( label, dayofweek, starttime, endtime ) VALUES ( 'US35 / I675 Loop', 5, '1:00:00', '7:00:00' );
INSERT INTO deliveryroute ( label, dayofweek, starttime, endtime ) VALUES ( 'Center Dayton', 4, '1:00:00', '7:00:00' );
INSERT INTO deliveryroute ( label, dayofweek, starttime, endtime ) VALUES ( 'Germantown', 5, '1:00:00', '7:00:00' );
INSERT INTO deliveryroute ( label, dayofweek, starttime, endtime ) VALUES ( 'North Dayton', 4, '1:00:00', '7:00:00' );
INSERT INTO deliveryroute ( label, dayofweek, starttime, endtime ) VALUES ( 'Yellow Springs', 5, '1:00:00', '7:00:00' );

CREATE TABLE zipcoderoute (
    id             SERIAL PRIMARY KEY,
    zipcode        VARCHAR(10),
    routeid        INTEGER REFERENCES deliveryroute (id)
);

INSERT INTO tablemeta ( name, label, description, recorddescriptor ) VALUES ( 'deliveryoption', 'Delivery Option', 'Each row represents a potential delivery option for a CSA share', 'label' );

--COPY zipcoderoute(zipcode,routeid) FROM '/tmp/data.csv' (DELIMITER ',', FORMAT csv, HEADER false);
