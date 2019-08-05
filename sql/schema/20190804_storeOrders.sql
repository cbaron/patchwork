CREATE TABLE "storeOrder" (
    id                          SERIAL PRIMARY KEY,
    total                       REAL,
    "memberId"                  INTEGER,
    "paymentMethod"             VARCHAR(50),
    items                       JSONB,
    "isFilled"                  BOOLEAN DEFAULT FALSE,
    "isCancelled"               BOOLEAN DEFAULT FALSE,
    created                     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "storeTransaction" (
    id                          SERIAL PRIMARY KEY,
    action                      VARCHAR(50),
    amount                      REAL,
    "memberId"                  INTEGER,
    "orderId"                   INTEGER REFERENCES "storeOrder"(id),
    "checkNumber"               TEXT,
    notes                       TEXT,
    created                     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);