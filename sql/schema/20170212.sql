CREATE TABLE csacustomization (
    id             SERIAL PRIMARY KEY,
    intro          TEXT,
    paragraph      TEXT
);

INSERT INTO tablemeta ( name, label, description ) VALUES ( 'csacustomization', 'CSA Customization', 'Data to be displayed on the /csa page and /signup info modal (member info page).  One record only.' ); 

INSERT INTO csacustomization ( intro, paragraph ) VALUES ( 'The Option to Never Receive a Vegetable of Your Choice', 'We’re so pleased to be able to offer a bit of customization to all of our CSA members.  Every CSA member is welcome to identify one vegetable to never receive in your box (i.e. kohlrabi, fennel, beets).  Every week throughout the season when that vegetable would normally go in the box, we’ll replace it with an alternate item.  There is no fee associated with this added service.  We want to make sure you receive more of the vegetables you that you really like!' );
