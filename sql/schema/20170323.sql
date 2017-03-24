CREATE TABLE journal (
    id          SERIAL PRIMARY KEY,
    action      VARCHAR(50),
    value       REAL,
    checknumber TEXT,
    description TEXT
);

ALTER TABLE journal ADD COLUMN created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
