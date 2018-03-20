var Base = require('./__proto__'),
    Report = function() { return Base.apply( this, arguments ) }

Object.assign( Report.prototype, Base.prototype, {

    handleExport( model ) {
        this.response.writeHead( 200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment;filename="${model.name}-${this.query.from}-${this.query.to}.csv"`
        } )

        return this.Postgres.stream( this._csvWrap( model.query ).replace('$1', `'${this.query.from}'`).replace('$2', `'${this.query.to}'`), this.response )
    },

    handleQuery( model ) {
        return this.Postgres.query( model.query, model.id === 5 || model.id === 6 || model.id === 7 ? [ ] : [ this.query.from, this.query.to ], { rowsOnly: true } )
        .then( body => this.respond( { body } ) )
    },

    model: {
        1: {
            id: 1,
            name: 'get-member-info',
            label: 'Get Member Info',
            query: `SELECT p.name, p.email, m.phonenumber, m.address, m.zipcode ` +
                   `FROM member m ` +
                   `JOIN person p on m.personid = p.id ` +
                   `JOIN ( SELECT MIN( id ) as "id", memberid FROM membershare GROUP BY memberid ) ms on ms.memberid = m.id ` +
                   `WHERE p.created BETWEEN $1 AND $2 ORDER BY ms.id ASC`
        },

        2: {
            id: 2,
            name: 'get-member-options',
            label: 'Get Member Options',
            query: `SELECT p.name, s.label, dop.label, gd.label, soo.label, soo.unit ` +
                   `FROM member m ` +
                   `JOIN person p on m.personid = p.id ` +
                   `JOIN membershare ms on ms.memberid = m.id ` +
                   `JOIN share s on ms.shareid = s.id ` +
                   `JOIN membersharedelivery msd on ms.id = msd.membershareid ` +
                   `JOIN deliveryoption dop on msd.deliveryoptionid = dop.id ` +
                   `LEFT JOIN groupdropoff gd on msd.groupdropoffid = gd.id ` +
                   `LEFT JOIN membershareoption mso on mso.membershareid = ms.id ` +
                   `LEFT JOIN shareoptionoption soo on mso.shareoptionoptionid = soo.id ` +
                   `WHERE s.startdate BETWEEN $1 AND $2 ORDER BY ms.id ASC`
        },

        3: {
            id: 3,
            name: 'get-skipped-weeks',
            label: 'Get Skipped Weeks',
            query: `SELECT p.name, mssw.date ` +
                   `FROM member m ` +
                   `JOIN person p on m.personid = p.id ` +
                   `JOIN membershare ms on ms.memberid = m.id ` +
                   `JOIN membershareskipweek mssw on mssw.membershareid = ms.id ` +
                   `JOIN share s ON s.id = ms.shareid ` +
                   `WHERE s.startdate BETWEEN $1 AND $2 ORDER BY ms.id ASC`
        },

        4: {
            id: 4,
            name: 'get-csa-transactions',
            label: 'Get CSA Transactions',
            query: `SELECT p.name, ct.description, ct.action, ct.value, ct.created, ct."checkNumber" ` +
                   `FROM member m ` +
                   `JOIN person p on m.personid = p.id ` +
                   `JOIN membershare ms ON ms.memberid = m.id ` +
                   `JOIN "csaTransaction" ct ON ct."memberShareId" = ms.id ` +
                   `JOIN share s ON s.id = ms.shareid ` +
                   `WHERE s.startdate BETWEEN $1 AND $2 ORDER BY ct.created ASC`
        },

        5: {
            id: 5,
            name: 'get-delinquents',
            label: 'Get Delinquents',
            query: `SELECT p.name, m.onpaymentplan, s.name as "season", ss.value as "Season Signup", ( COALESCE(owes.sum,0) - COALESCE(paid.sum,0) ) as "Owes" ` +
                   `FROM person p ` +
                   `JOIN member m ON p.id = m.personid ` +
                   `JOIN membershare ms ON ms.memberid = m.id ` +
                   `LEFT JOIN ( select "memberShareId", COALESCE(SUM(value),0) as sum from "csaTransaction" WHERE action != 'Payment' GROUP BY "memberShareId" ) owes ON owes."memberShareId" = ms.id ` +
                   `LEFT JOIN ( select "memberShareId", COALESCE(SUM(value),0) as sum from "csaTransaction" WHERE action = 'Payment' GROUP BY "memberShareId" ) paid ON paid."memberShareId" = ms.id ` +
                   `JOIN share s ON s.id = ms.shareid ` +
                   `LEFT JOIN ( SELECT "memberShareId", value FROM "csaTransaction" WHERE action = 'Season Signup' ) ss ON ss."memberShareId" = ms.id ` +
                   `WHERE ( COALESCE(owes.sum,0) - COALESCE(paid.sum,0) ) > 0 ` +
                   `ORDER BY "Owes"`
        },

        6: {
            id: 6,
            name: 'get-food-omission',
            label: 'Get Food Omission',
            query: `SELECT p.name, pr.name as "produce", prf.name as "produce family" ` +
                   `FROM member m ` +
                   `JOIN person p ON m.personid = p.id ` +
                   `JOIN memberfoodomission mfo ON mfo.memberid = m.id ` +
                   `LEFT JOIN produce pr on pr.id = mfo.produceid ` +
                   `LEFT JOIN producefamily prf on prf.id = mfo.producefamilyid ` +
                   `ORDER BY p.name ASC`
        },

        7: {
            id: 7,
            name: 'get-creditors',
            label: 'Get Creditors',
            query: `SELECT p.name, m.onpaymentplan, s.name as "season", ss.value as "Season Signup", ( COALESCE(owes.sum,0) - COALESCE(paid.sum,0) ) as "Owes" ` +
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
