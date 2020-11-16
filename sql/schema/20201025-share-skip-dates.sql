CREATE TABLE "shareSkipDate" (
  id             SERIAL PRIMARY KEY,
  "shareId"      INTEGER REFERENCES share (id),
  date           DATE
);