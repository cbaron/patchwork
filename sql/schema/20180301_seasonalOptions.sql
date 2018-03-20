CREATE TABLE "seasonalAddOn" (
    id                          SERIAL PRIMARY KEY,
    shareid                     INTEGER REFERENCES share(id),
    name                        VARCHAR(100),
    label                       VARCHAR(100),
    description                 TEXT
);

CREATE TABLE "seasonalAddOnOption" (
    id                          SERIAL PRIMARY KEY,
    "seasonalAddOnId"           INTEGER REFERENCES "seasonalAddOn"(id),
    name                        VARCHAR(50),
    label                       VARCHAR(50),
    price                       MONEY,
    unit                        VARCHAR(20)
);

CREATE TABLE "memberShareSeasonalAddOn" (
    id                          SERIAL PRIMARY KEY,
    "seasonalAddOnId"           INTEGER REFERENCES "seasonalAddOn"(id),
    "seasonalAddOnOptionId"     INTEGER REFERENCES "seasonalAddOnOption"(id),
    "memberShareId"             INTEGER REFERENCES membershare(id)
);