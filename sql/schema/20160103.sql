CREATE TABLE tablemeta (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100),
    label          VARCHAR(20),
    description    VARCHAR(200)
);

INSERT INTO tablemeta ( name, label, description ) VALUES ( 'member', 'Members', 'Holds member information' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'membershare', 'Member Shares', 'Links a member to a share.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'membershareoption', 'Member Share Options', 'Links a membershare with a share option.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'memberskipweek', 'Member Skip Weeks', 'Holds the weeks a member cannot pickup.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'person', 'People', 'Holds user information.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'personrole', 'People Roles', 'Links a person with a role.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'role', 'Roles', 'Holds role information.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'season', 'Seasons', 'Details season information.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'share', 'Shares', 'Details share information.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'shareoption', 'Share Options', 'Share Option detail.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'shareoptionshare', 'Share Options/Share', 'Links a share option with a specific share.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'transaction', 'Transactions', 'Transaction Detail.' );
INSERT INTO tablemeta ( name, label, description ) VALUES ( 'tablemeta', 'Table MetaData', 'Information about Tables.' );
