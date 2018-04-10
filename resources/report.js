var Base = require('./__proto__'),
    Report = function() { return Base.apply( this, arguments ) }

Object.assign( Report.prototype, Base.prototype, {

    getValuesAndWhere( model ) {
        let values, whereString

        if( this.query.shareId ) {
            values = [ this.query.shareId ]
            whereString = `ms.shareid = $1`
        } else if( this.query.year ) {
            values = [ `${this.query.year}-01-01`, `${this.query.year}-12-31` ]
            whereString = `s.startdate BETWEEN $1 AND $2`
        } else {
            values = [ this.query.from, this.query.to ]
            whereString = `ct.created BETWEEN $1 AND $2`
        }

        if( model.id === 5 || model.id === 6 || model.id === 7 ) { values = [ ]; whereString = `` }

        return { values, whereString }
    },

    handleExport( model ) {
        const { values, whereString } = this.getValuesAndWhere( model ),
            fileString = Object.keys( this.query ).filter( key => ![ 'id', 'export', 'shareId' ].includes( key ) ).map( key => this.query[key] ).join('_')

        let query = model.query( whereString )

        values.forEach( ( val, i ) => { query = query.replace( `$${i+1}`, `'${val}'` ) } )

        this.response.writeHead( 200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment;filename="${model.name}-${fileString}.csv"`
        } )

        return this.Postgres.stream( this._csvWrap( query ), this.response )

    },

    handleQuery( model ) {
        const { values, whereString } = this.getValuesAndWhere( model )

        return this.Postgres.query( model.query( whereString ), values, { rowsOnly: true } )
        .then( body => this.respond( { body } ) )
    },

    model: {
        1: {
            id: 1,
            name: 'get-member-info',
            label: 'Get Member Info',
            query( where ) {
                return `` +
                `SELECT p.name as "Name", p.email as "Email", m.phonenumber as "Phone", m.address as "Address", m.zipcode as "Zip", s.label as "Season", ct.created as "Signup Date" ` +
                `FROM member m ` +
                `JOIN person p on m.personid = p.id ` +
                `JOIN membershare ms on ms.memberid = m.id ` +
                `JOIN "csaTransaction" ct ON ct."memberShareId" = ms.id ` +
                `JOIN share s on ms.shareid = s.id ` +
                `WHERE ct.action = 'Season Signup' AND ${where} ` +
                `ORDER BY p.name, ct.created ASC`
            }
        },

        2: {
            id: 2,
            name: 'get-member-options',
            label: 'Get Member Options',
            query( where ) {
                return `` +
                `SELECT p.name as "Name", s.label as "Season", dop.label as "Delivery", gd.label as "Group Dropoff", so.name as "Share Option", soo.label as "Choice", soo.unit as "Unit" ` +
                `FROM member m ` +
                `JOIN person p on m.personid = p.id ` +
                `JOIN membershare ms on ms.memberid = m.id ` +
                `JOIN "csaTransaction" ct ON ct."memberShareId" = ms.id ` +
                `JOIN share s on ms.shareid = s.id ` +
                `JOIN membersharedelivery msd on ms.id = msd.membershareid ` +
                `JOIN deliveryoption dop on msd.deliveryoptionid = dop.id ` +
                `JOIN groupdropoff gd on msd.groupdropoffid = gd.id ` +
                `JOIN membershareoption mso on mso.membershareid = ms.id ` +
                `JOIN shareoption so on mso.shareoptionid = so.id ` +
                `JOIN shareoptionoption soo on mso.shareoptionoptionid = soo.id ` +
                `WHERE ct.action = 'Season Signup' AND ${where} ` +
                `ORDER BY p.name, ct.created ASC`
            }
        },

        3: {
            id: 3,
            name: 'get-skipped-weeks',
            label: 'Get Skipped Weeks',
            query( where ) {
                return `` +
                `SELECT p.name as "Name", s.label as "Share", mssw.date as "Skipped Date" ` +
                `FROM member m ` +
                `JOIN person p on m.personid = p.id ` +
                `JOIN membershare ms on ms.memberid = m.id ` +
                `JOIN "csaTransaction" ct ON ct."memberShareId" = ms.id ` +
                `JOIN membershareskipweek mssw on mssw.membershareid = ms.id ` +
                `JOIN share s ON s.id = ms.shareid ` +
                `WHERE ct.action = 'Season Signup' AND ${where} ` +
                `ORDER BY p.name, ct.created ASC`
            }
        },

        4: {
            id: 4,
            name: 'get-csa-transactions',
            label: 'Get CSA Transactions',
            query( where ) {
                return `` +
                `SELECT p.name as "Name", ct.description as "Description", ct.action as "Action", ct.initiator as "Initiator", ct.value as "Value", ct.created as "Date", ct."checkNumber" as "Check Number" ` +
                `FROM member m ` +
                `JOIN person p on m.personid = p.id ` +
                `JOIN membershare ms ON ms.memberid = m.id ` +
                `JOIN "csaTransaction" ct ON ct."memberShareId" = ms.id ` +
                `JOIN share s ON s.id = ms.shareid ` +
                `WHERE ${where} ` +
                `ORDER BY p.name, ct.created ASC`
            }
        },

        5: {
            id: 5,
            name: 'get-delinquents',
            label: 'Get Delinquents',
            query() {
                return `` +
                `SELECT p.name as "Name", m.onpaymentplan as "On Payment Plan", s.name as "Season", ss.value as "Season Signup", ( COALESCE(owes.sum,0) - COALESCE(paid.sum,0) ) as "Owes" ` +
                `FROM person p ` +
                `JOIN member m ON p.id = m.personid ` +
                `JOIN membershare ms ON ms.memberid = m.id ` +
                `LEFT JOIN ( select "memberShareId", COALESCE(SUM(value),0) as sum from "csaTransaction" WHERE action != 'Payment' GROUP BY "memberShareId" ) owes ON owes."memberShareId" = ms.id ` +
                `LEFT JOIN ( select "memberShareId", COALESCE(SUM(value),0) as sum from "csaTransaction" WHERE action = 'Payment' GROUP BY "memberShareId" ) paid ON paid."memberShareId" = ms.id ` +
                `JOIN share s ON s.id = ms.shareid ` +
                `LEFT JOIN ( SELECT "memberShareId", value FROM "csaTransaction" WHERE action = 'Season Signup' ) ss ON ss."memberShareId" = ms.id ` +
                `WHERE ( COALESCE(owes.sum,0) - COALESCE(paid.sum,0) ) > 0 ` +
                `ORDER BY "Owes"`
            }
        },

        6: {
            id: 6,
            name: 'get-food-omission',
            label: 'Get Food Omission',
            query() {
                return `` +
                `SELECT p.name as "Name", pr.name as "Produce", prf.name as "Produce Family" ` +
                `FROM member m ` +
                `JOIN person p ON m.personid = p.id ` +
                `JOIN memberfoodomission mfo ON mfo.memberid = m.id ` +
                `LEFT JOIN produce pr on pr.id = mfo.produceid ` +
                `LEFT JOIN producefamily prf on prf.id = mfo.producefamilyid ` +
                `ORDER BY p.name ASC`
            }
        },

        7: {
            id: 7,
            name: 'get-creditors',
            label: 'Get Creditors',
            query() {
                return `` +
                `SELECT p.name as "Name", m.onpaymentplan as "On Payment Plan", s.name as "Season", ss.value as "Season Signup", ( COALESCE(owes.sum,0) - COALESCE(paid.sum,0) ) as "Owes" ` +
                `FROM person p ` +
                `JOIN member m ON p.id = m.personid ` +
                `JOIN membershare ms ON ms.memberid = m.id ` +
                `LEFT JOIN ( select "memberShareId", COALESCE(SUM(value),0) as sum from "csaTransaction" WHERE action != 'Payment' GROUP BY "memberShareId" ) owes ON owes."memberShareId" = ms.id ` +
                `LEFT JOIN ( select "memberShareId", COALESCE(SUM(value),0) as sum from "csaTransaction" WHERE action = 'Payment' GROUP BY "memberShareId" ) paid ON paid."memberShareId" = ms.id ` +
                `JOIN share s ON s.id = ms.shareid ` +
                `LEFT JOIN ( SELECT "memberShareId", value FROM "csaTransaction" WHERE action = 'Season Signup' ) ss ON ss."memberShareId" = ms.id ` +
                `WHERE ( COALESCE(owes.sum,0) - COALESCE(paid.sum,0) ) < 0 ` +
                `ORDER BY "Owes"`
            }
        }

    },

    GET() {

        return this.validate.GET.call(this)
        .then( () => {
            if( !this.user.id || !this.user.roles.includes('admin') ) return this.badRequest()

            this.getQs()

            const model = this.model[ this.query.id ]

            if( !model ) return this.respond( { body: Object.keys( this.model ).map( id => ( { id, label: this.model[ id ].label } ) ) } )
            
            return this.query.export === true
                ? this.handleExport( model )
                : this.handleQuery( model )
        } )
    },

    _csvWrap( query ) { return `COPY ( ${query} ) to STDOUT WITH CSV HEADER` }

} )

module.exports = Report
