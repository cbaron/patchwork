#!/usr/bin/env node

require('node-env-file')( __dirname + '/../.env' );

const Postgres = require('../dal/postgres');
const bcrypt = require('bcrypt-nodejs');

/**
 * createAdminUser.js
 *
 * Intended for use at the command line to create an admin user account in the database.
 *
 * Usage: $ node createAdminUser.js myUsername myPassword
 *
 **/

if (!process.argv[2] || !process.argv[3] || !process.argv[4]) {
	console.log('Usage: node createAdminUser.js "Real Name" email myPassword');
	return 0;
}
const realName = process.argv[2];
const email = process.argv[3];
const plainPassword = process.argv[4];
const encryptedPassword = bcrypt.hashSync( plainPassword );

Postgres.initialize().then(() => {
	return Postgres.query( `INSERT INTO person (password, name, email, "emailVerified") values ('${encryptedPassword}', '${realName}', '${email}', 'true');`, {}, {});
})
.then((result) => {
	return Postgres.query(`INSERT INTO personrole (personid, roleid) SELECT person.id, role.id from person, role where person.email = '${email}' and role.name = 'admin';`, {}, {});
})
.catch( e => console.log( e.stack || e ) )

console.log(`Admin user '${email}' created`)
return;