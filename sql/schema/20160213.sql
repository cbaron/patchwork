CREATE TABLE employment (
    id                SERIAL PRIMARY KEY,
    jobtitle          VARCHAR(100),
    jobdescription    bytea,
    visible           BOOLEAN
);

INSERT INTO tablemeta ( name, label, description ) VALUES ( 'employment', 'Employment', 'Each record represents a job posting on the /get-involved page' );