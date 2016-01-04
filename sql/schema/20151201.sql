CREATE TABLE member (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    email          VARCHAR(100),
    phonenumber    VARCHAR(16),
    address        VARCHAR(100),
    balance        MONEY DEFAULT 0
);

CREATE TABLE season (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    label          VARCHAR(100)
);

CREATE TABLE share (
    id             SERIAL PRIMARY KEY,
    startdate      DATE,
    enddate        DATE
);

CREATE TABLE shareoption (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    label          VARCHAR(100)
);

CREATE TABLE shareoptionsshare (
    id             SERIAL PRIMARY KEY,
    shareid        INTEGER REFERENCES share (id),
    shareoptionid  INTEGER REFERENCES shareoption (id)
);

CREATE TABLE membershare (
    id             SERIAL PRIMARY KEY,
    memberid       INTEGER REFERENCES member (id),
    shareid        INTEGER REFERENCES share (id)
);

CREATE TABLE membershareoption (
    id             SERIAL PRIMARY KEY,
    memberid       INTEGER REFERENCES member (id),
    shareoptionsshareid INTEGER REFERENCES shareoptionsshare (id)
);

CREATE TABLE memberskipweek (
    id             SERIAL PRIMARY KEY,
    memberid       INTEGER REFERENCES member (id),
    shareid        INTEGER REFERENCES share (id),
    date           DATE
);

CREATE TABLE transaction (
    id             SERIAL PRIMARY KEY,
    description    VARCHAR(255),
    memberid       INTEGER REFERENCES member (id),
    origin         TEXT,
    amount         MONEY
);
