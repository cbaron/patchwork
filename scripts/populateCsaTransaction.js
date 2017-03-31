#!/usr/bin/env node

require('node-env-file')( __dirname + '/../.env' );

const Postgres = require('../dal/postgres'),
    Moment = require('moment')

let sharesById = { },
    shareOptionOptionsById = { },
    deliveryOptionsById = { },
    deliveryRoutesById = { },
    farmRoute = undefined,
    memberIdToMemberShareIds = { }

const getDayOfWeek = ( delivery, shareId, memberId ) => {
    return delivery.groupdropoffid
        ? Postgres.query( `SELECT * FROM sharegroupdropoff WHERE shareid = ${shareId} AND groupdropoffid = ${delivery.groupdropoffid}` )
          .then( response => Promise.resolve( response.rows[0].dayofweek ) )
        : deliveryOptionsById[ delivery.deliveryoptionid ].name === 'farm'
            ? farmRoute.dayofweek
            : Postgres.query( `SELECT dr.dayofweek FROM deliveryroute dr JOIN zipcoderoute zcr ON dr.id = zcr.routeid WHERE zcr.zipcode = ( SELECT zipcode FROM member WHERE id = ${memberId} )` )
              .then( response => Promise.resolve( response.rows.length ? response.rows[0].dayofweek : undefined ) )
} 

const determineDates = ( share, dayOfWeek ) => {
    const dates = [ ]

    if( ! Number.isInteger( dayOfWeek ) ) throw Error("No Day Of Week")

    const now = Moment(),
        endDate = Moment( share.enddate )
        
    let deliveryDate = Moment( share.startdate ),
        startDay = deliveryDate.day()

    while( startDay != dayOfWeek ) {
        deliveryDate.add( 1, 'days' )
        startDay = Moment( deliveryDate ).day()
    }
    
    while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
        dates.push( Moment( deliveryDate ) )
        deliveryDate.add( 7, 'days' )
    }

    return dates
}

const moneyToReal = price => parseFloat( price.replace( /\$|,/g, "" ) )

const addCsaTransaction = ( shareId, memberShareId, memberId, paymentMethod ) => {
    let weeklyTotal = 0,
        delivery = undefined,
        description = ''

    return Postgres.query( `SELECT * FROM membershareoption WHERE membershareid = ${memberShareId}` )
    .then( result => {
        const optionDescription = [ ]
        result.rows
            .sort( ( a, b ) => moneyToReal( shareOptionOptionsById[ a.shareoptionoptionid ].price ) - moneyToReal( shareOptionOptionsById[ a.shareoptionoptionid ].price ) )
            .forEach( option => {
                weeklyTotal += moneyToReal( shareOptionOptionsById[ option.shareoptionoptionid ].price )
                optionDescription.push( `${ shareOptionsById[ option.shareoptionid ].name } ${ shareOptionOptionsById[ option.shareoptionoptionid ].label } ${ shareOptionOptionsById[ option.shareoptionoptionid ].unit || '' }` )
            } )
        description = optionDescription.join(', ') + ` -- `
        return Postgres.query( `SELECT * FROM membersharedelivery WHERE membershareid = ${memberShareId}` )
    } )
    .then( result => {
        delivery = result.rows[0]
        deliveryOption = deliveryOptionsById[ result.rows[0].deliveryoptionid ]
        weeklyTotal += moneyToReal( deliveryOption.price )
        description += deliveryOption.label + ` -- `
        return getDayOfWeek( result.rows[0], shareId, memberId )
    } )
    .then( dayOfWeek => {
        if( !dayOfWeek ) { console.log( `DayOfWeek issue for memberId: ${memberId}` ); return Promise.resolve() }

        return Promise.all( [
            Promise.resolve( determineDates( sharesById[ shareId ], dayOfWeek ).length ),
            Postgres.query( `SELECT to_char(date, 'MM-DD') FROM membershareskipweek WHERE membershareid = ${memberShareId}` )
        ] )
        .then( ( [ shareDateLength, skipResult ] ) => {
            const total = weeklyTotal * ( shareDateLength - skipResult.rows.length )
            if( skipResult.rows.length ) description += `Absent: ` + skipResult.rows.map( row => row.to_char ).join(', ')
            if( !memberIdToMemberShareIds[ memberId ] ) memberIdToMemberShareIds[ memberId ] = [ ]
            if( paymentMethod === 'Stripe' ) { memberIdToMemberShareIds[ memberId ].push( { id: memberShareId, value: total } ) }
            return Postgres.query(
                `INSERT INTO "csaTransaction" ( action, value, "memberShareId", description ) VALUES ( 'Season Signup', $1, ${memberShareId}, $2 )`,
                [ total, description ]
            )
        } )
    } )
}

const addStripeTransactions = memberId => {
    return Postgres.query( `SELECT * FROM transaction WHERE created >= '2016-12-17' AND memberid = ${memberId}` )
    .then( result => {
        if( result.rows.length === 0 ) return

        const memberShares = memberIdToMemberShareIds[ memberId ]

        if( memberShares ) {
            if( memberShares.reduce( ( memo, memberShare ) => memo += memberShare.value, 0 ) == result.rows.reduce( ( memo, row ) => memo += moneyToReal( row.amount ), 0 ) ) {
                return Promise.all( memberShares.map( memberShare =>
                    Postgres.query( `INSERT INTO "csaTransaction" ( action, value, "memberShareId", description ) VALUES ( 'Payment', ${memberShare.value}, ${memberShare.id}, 'Stripe' )` )
                ) )
            } else {
                const memberShareValues = memberShares.sort( ( a, b ) => a.value - b.value ).map( share => share.value ),
                    rowValues = result.rows.sort( ( a, b ) => moneyToReal( a.amount ) - moneyToReal( b.amount ) ).map( row => moneyToReal( row.amount ) )

                let i,j = 0, matches = [ ]
                while( i < memberShareValues.length && j < rowValues.length ) {
                    if( i == j ) { matches.push( i ) }
                    else if( i > j ) { j++ }
                    else { i++ }
                }

                if( matches.length ) {
                    return Promise.all(
                        matches.map( i => Postgres.query( `INSERT INTO "csaTransaction" ( action, value, "memberShareId", description ) VALUES ( 'Payment', ${memberShares[i].value}, ${memberShares[i].id}, 'Stripe' )` ) )
                    )
                } else {
                    console.log( `Found Stripe Transactions, but no match for memberId: ${memberId}` )
                    return Promise.resolve()
                }
            }
        } else { return Promise.resolve() }
    } )
}

Promise.all( [
    Postgres.query( `SELECT * FROM share WHERE startdate > '2017-01-01'` ),
    Postgres.query( `SELECT * FROM shareOption` ),
    Postgres.query( `SELECT * FROM shareoptionoption` ),
    Postgres.query( `SELECT * FROM deliveryoption` ),
    Postgres.query( `SELECT * FROM deliveryroute` ),
] )
.then( ( [ shares, shareOptions, shareOptionOptions, deliveryOptions, deliveryRoutes ] ) => {
    sharesById = shares.rows.reduce( ( memo, share ) => Object.assign( memo, { [ share.id ]: share } ), { } )
    shareOptionsById = shareOptions.rows.reduce( ( memo, shareOption ) => Object.assign( memo, { [ shareOption.id ]: shareOption } ), { } )
    shareOptionOptionsById = shareOptionOptions.rows.reduce( ( memo, shareOptionOption ) => Object.assign( memo, { [ shareOptionOption.id ]: shareOptionOption } ), { } )
    deliveryOptionsById = deliveryOptions.rows.reduce( ( memo, deliveryOption ) => Object.assign( memo, { [ deliveryOption.id ]: deliveryOption } ), { } )
    deliveryRoutesById = deliveryRoutes.rows.reduce( ( memo, deliveryRoute ) => Object.assign( memo, { [ deliveryRoute.id ]: deliveryRoute } ), { } )
    farmRoute = deliveryRoutes.rows.find( deliveryRoute => deliveryRoute.label === 'farm' )
    return Postgres.query( `SELECT * FROM membershare WHERE shareid IN ( ${ shares.rows.map( row => row.id ).join(', ') } )` )
} )
.then( result =>
    Promise.all( result.rows.map( row => addCsaTransaction( row.shareid, row.id, row.memberid, row.paymentmethod ) ) )
)
.then( () => Postgres.query( `SELECT DISTINCT( memberid ) FROM membershare WHERE shareid IN ( ${ Object.keys( sharesById ).join(', ') } )` ) )
.then( result => Promise.all( result.rows.map( row => addStripeTransactions( row.memberid ) ) ) )
.catch( require( '../lib/MyError' ) )
.then( () =>  process.exit(0) )
