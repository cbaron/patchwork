CREATE TABLE csacustomization (
    id             SERIAL PRIMARY KEY,
    intro          TEXT,
    paragraph      TEXT
);

INSERT INTO tablemeta ( name, label, description ) VALUES ( 'csacustomization', 'CSA Customization', 'Data to be displayed on the /csa page and /signup info modal (member info page).  One record only.' ); 