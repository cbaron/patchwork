const Base = require('./__proto__'),
    WeeklyReminder = function() { return Base.apply( this, arguments ) }

Object.assign( WeeklyReminder.prototype, Base.prototype, {

    db: {
        GET() {
            return this.query.category === 'deliveryType'
                ? this[ `${this.query.selection}Query` ]()
                : this[ `${this.query.category}Query` ]()
        }
    },

    checkFarmDeliveryDay() {
        return this.Postgres.query(
            `SELECT dayofweek FROM deliveryroute WHERE label = 'farm'`,
            [ ],
            { rowsOnly: true }
        )
    },

    async dayQuery() {
        let farmResults = [ ]

        const farmDelivery = await this.checkFarmDeliveryDay()
        if( farmDelivery.length && farmDelivery[0].dayofweek == this.query.selection ) farmResults = await this.farmQuery()

        const groupResults = await this.groupDropoffsQuery( true )
        const homeResults = await this.homeQuery( true )

        return [ ...farmResults, ...groupResults, ...homeResults ]
    },

    farmQuery() {
        return this.Postgres.query(
            `SELECT p.name, p.email, p."secondaryEmail", ms.id as "memberShareId", dop.label as "delivery"
            FROM member m
            JOIN person p on m.personid = p.id
            JOIN membershare ms on ms.memberid = m.id
            JOIN share s on ms.shareid = s.id
            JOIN membersharedelivery msd on ms.id = msd.membershareid
            JOIN deliveryoption dop on msd.deliveryoptionid = dop.id
            WHERE msd.deliveryoptionid = (SELECT id FROM deliveryoption where name = 'farm') AND now() BETWEEN s.startdate AND s.enddate
            ORDER BY p.name ASC`,
            [ ],
            { rowsOnly: true }
        )

    },

    groupDropoffsQuery( filterByDay = false ) {
        const where = filterByDay ? `AND sgd.dayofweek = $1 ` : ``
        const vals = filterByDay ? [ this.query.selection ] : [ ]

        return this.Postgres.query(
            `SELECT p.name, p.email, p."secondaryEmail", ms.id as "memberShareId", dop.label as "delivery"
            FROM member m
            JOIN person p on m.personid = p.id
            JOIN membershare ms on ms.memberid = m.id
            JOIN share s on ms.shareid = s.id
            JOIN membersharedelivery msd on ms.id = msd.membershareid
            JOIN deliveryoption dop on msd.deliveryoptionid = dop.id
            JOIN groupdropoff gd on msd.groupdropoffid = gd.id
            JOIN sharegroupdropoff sgd ON gd.id = sgd.groupdropoffid AND s.id = sgd.shareid
            WHERE now() BETWEEN s.startdate AND s.enddate ${where}
            ORDER BY p.name ASC`,
            vals,
            { rowsOnly: true }
        )
    },

    homeQuery( filterByDay = false ) {
        const where = filterByDay ? `AND dr.dayofweek = $1 ` : ``
        const vals = filterByDay ? [ this.query.selection ] : [ ]

        return this.Postgres.query(
            `SELECT p.name, p.email, p."secondaryEmail", ms.id as "memberShareId", dop.label as "delivery"
            FROM member m
            JOIN person p on m.personid = p.id
            JOIN membershare ms on ms.memberid = m.id
            JOIN share s on ms.shareid = s.id
            JOIN membersharedelivery msd on ms.id = msd.membershareid
            JOIN deliveryoption dop on msd.deliveryoptionid = dop.id
            LEFT JOIN zipcoderoute zcr ON m.zipcode = zcr.zipcode
            LEFT JOIN deliveryroute dr ON dr.id = zcr.routeid
            WHERE now() BETWEEN s.startdate AND s.enddate
            AND msd.deliveryoptionid = (SELECT id FROM deliveryoption WHERE name = 'home')
            ${where}
            ORDER BY p.name ASC`,
            vals,
            { rowsOnly: true }
        )
    },

    singleGroupQuery() {
        return this.Postgres.query(
            `SELECT p.name, p.email, p."secondaryEmail", ms.id as "memberShareId", dop.label as "delivery"
            FROM member m
            JOIN person p on m.personid = p.id
            JOIN membershare ms on ms.memberid = m.id
            JOIN share s on ms.shareid = s.id
            JOIN membersharedelivery msd on ms.id = msd.membershareid
            JOIN deliveryoption dop on msd.deliveryoptionid = dop.id
            JOIN groupdropoff gd on msd.groupdropoffid = gd.id
            JOIN sharegroupdropoff sgd ON gd.id = sgd.groupdropoffid AND s.id = sgd.shareid
            WHERE gd.name = $1 AND now() BETWEEN s.startdate AND s.enddate
            ORDER BY p.name ASC`,
            [ this.query.selection ],
            { rowsOnly: true }
        )
    }

} )

module.exports = WeeklyReminder