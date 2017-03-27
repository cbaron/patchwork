CREATE TABLE "csaTransaction" (
    id                          SERIAL PRIMARY KEY,
    action                      VARCHAR(50),
    value                       REAL,
    "memberShareId"             INTEGER,
    "checkNumber"               TEXT,
    description                 TEXT,
    created                     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
