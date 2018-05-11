ALTER TABLE person ADD COLUMN "emailVerified" BOOLEAN default false;
UPDATE person SET "emailVerified" = true;

ALTER TABLE "csaTransaction" ADD COLUMN initiator VARCHAR(50);
UPDATE "csaTransaction" SET initiator = 'admin';