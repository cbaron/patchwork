ALTER TABLE carousel ADD COLUMN position INTEGER;
ALTER TABLE staffprofile ADD COLUMN position INTEGER;
ALTER TABLE internshipduty ADD COLUMN position INTEGER;
ALTER TABLE internshipqualification ADD COLUMN position INTEGER;
ALTER TABLE internshipcompensation ADD COLUMN position INTEGER;
ALTER TABLE csastatements ADD COLUMN position INTEGER;
ALTER TABLE largeshareexamplecolumnone ADD COLUMN position INTEGER;
ALTER TABLE largeshareexamplecolumntwo ADD COLUMN position INTEGER;

CREATE TABLE header (
	id            SERIAL PRIMARY KEY,
	page          VARCHAR(100),
	color         VARCHAR(100),
	hovercolor    VARCHAR(100),
	image         bytea,
	mobileimage   bytea
);
