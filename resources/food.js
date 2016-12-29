var Base = require('./__proto__'),
    Food = function() { return Base.apply( this, arguments ) }

Object.assign( Food.prototype, Base.prototype, {

    db: Object.assign( {}, Base.prototype.db, {
        GET: function() {
            return this.dbQuery( { query:
                `SELECT * FROM ` +
                `( SELECT NULL as produceid, pf.name, pf.id as producefamilyid FROM producefamily pf UNION SELECT p.id as produceid, p.name, p.producefamilyid FROM produce p ) foo ` +
                `ORDER BY producefamilyid, produceid DESC` } )
        }
    } )
} )

module.exports = Food
