var Base = require('./__proto__'),
    CurrentGroups = function() { return Base.apply( this, arguments ) }

Object.assign( CurrentGroups.prototype, Base.prototype, {

    async GET() {
        const { rows } = await this.Postgres.query(
            `SELECT DISTINCT(gd.id), gd.name, gd.venue, gd.street, gd."cityStateZip", ST_AsGeoJSON(gd.location) AS "location", sgd.dayofweek, sgd.starttime, sgd.endtime
            FROM groupdropoff gd
            JOIN sharegroupdropoff sgd ON gd.id = sgd.groupdropoffid
            JOIN share s on s.id = sgd.shareid
            WHERE s.enddate::date > now() + INTERVAL '2 week' AND s.signupcutoff > now()`
        )

        this.respond( { body: rows } )
    }

} )

module.exports = CurrentGroups