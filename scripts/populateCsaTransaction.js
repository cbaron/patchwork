#!/usr/bin/env node

require('node-env-file')( __dirname + '/../.env' );

const Postgres = require('../dal/postgres'),
    Moment = require('moment')

let sharesById = { },
    shareOptionOptionsById = { },
    deliveryOptionsById = { },
    deliveryRoutesById = { },
    farmRoute = undefined

const getDayOfWeek = ( delivery, shareId, memberId ) {
    return delivery.groupdropoff.id
        ? Postgres.query( `SELECT * FROM sharegroupdropoff WHERE shareid = ${shareId} AND groupdropoffid = ${deliverygroupdropoff.id}` )
          .then( response => Promise.resolve( response.rows[0].dayofweek ) )
        : deliveryOptionsById[ delivery.deliveryoptionid ].name === 'farm'
            ? farmRoute.dayofweek
            : Postgres.query( `SELECT dr.dayofweek FROM deliveryroute dr JOIN zipcoderoute zcr ON dr.id = zcr.routeid WHERE zcr.zipcode = ( SELECT zipcode FROM member WHERE id = ${memberId} )` )
              .then( response => Promise.resolve( response.rows[0].dayofweek ) )
} 

const determineDates( share, dayOfWeek ) {
    const dates = [ ]

    if( ! Number.isInteger( dayOfWeek ) ) throw Error("No Day Of Week")

    const now = Moment(),
        endDate = this.Moment( share.enddate )
        
    let deliveryDate = this.Moment( share.startdate ),
        startDay = deliveryDate.day()

    while( startDay != dayOfWeek ) {
        deliveryDate.add( 1, 'days' )
        startDay = this.Moment( deliveryDate ).day()
    }
    
    while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
        dates.push( { date: this.Moment( deliveryDate )
        deliveryDate.add( 7, 'days' )
    }

    return dates
}

const moneyToReal = price => price.replace( /\$|,/g, "" )

const addCsaTransaction = ( shareId, memberShareId, memberId ) => {
    let weeklyTotal = 0,
        delivery = undefined,
        description = ''

    return Postgres.query( `SELECT * FROM membershareoption JOIN  WHERE membershareid = ${memberShareId}` )
    .then( result => {
        const optionDescription = [ ]
        result.rows
            .sort( ( a, b ) => moneyToReal( shareOptionOptionsById[ a.shareoptionoptionid ].price ) - moneyToReal( shareOptionOptionsById[ a.shareoptionoptionid ].price ) )
            .forEach( option => {
                weeklyTotal += shareOptionOptionsById[ option.shareoptionoptionid ].price.replace( /\$|,/g, "" )
                optionDescription.push( `${ shareOptionsById[ row.shareoptionid ].name } ${ shareOptionOptionsById[ option.shareoptionoptionid ].label } ${ shareOptionOptionsById[ option.shareoptionoptionid ].unit || '' }` )
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
    .then( dayOfWeek => 
        Promise.all( [
            Promise.resolve( determineDates( sharesById[ shareId ], dayOfWeek ).length ),
            Postgres.query( `SELECT to_char(date, 'MM-DD') FROM membershareskipweek WHERE membershareid = ${memberShareId}` )
        ] )
    )
    .then( ( [ shareDateLength, skipResult ] ) => {
        const total = weeklyTotal * ( shareDateLength - skipResult.rows.length )
        if( skipResult.rows.length ) description += `Absent: ` + skipResult.rows.map( row.to_char ).join(', ')
        return Postgres.query(
            `INSERT INTO "csaTransaction" ( ( action, value, "memberShareId", description ) VALUES ( 'Season Signup', $1, ${memberShareId}, $2 )`
            [ total, description ]
    } )
    
Share size Large, Bread shares 1 loaf, Extra greens 1 bag -- On-farm Pickup -- Absent: 06-15, 07-27, 09-07, 10-19, 10-26
}

Promise.all( [
    Postgres.query( `SELECT * FROM share WHERE startdate > '2017-01-01'` ),
    Postgres.query( `SELECT * FROM shareOption` ),
    Postgres.query( `SELECT * FROM shareoptionoption` ),
    Postgres.query( `SELECT * FROM deliveryoption` ),
    Postgres.query( `SELECT * FROM deliveryroute` ),
.then( ( [ shares, shareOptions, shareOptionOptions, deliveryOptions, deliveryRoutes ] ) => {
    sharesById = shares.rows.reduce( ( memo, share ) => Object.assign( memo, { [ share.id ]: share } ), { } )
    shareOptionsById = shareOptions.rows.reduce( ( memo, shareOption ) => Object.assign( memo, { [ shareOption.id ]: shareOption } ), { } )
    shareOptionOptionsById = shareOptionOptions.rows.reduce( ( memo, shareOptionOption ) => Object.assign( memo, { [ shareOptionOption.id ]: shareOptionOption } ), { } )
    deliveryOptionsById = deliveryOptions.rows.reduce( ( memo, deliveryOption ) => Object.assign( memo, { [ deliveryOption.id ]: deliveryOption } ), { } )
    deliveryRoutesById = deliveryRoutes.rows.reduce( ( memo, deliveryRoute ) => Object.assign( memo, { [ deliveryRoute.id ]: deliveryRoute } ), { } )
    farmRoute = deliveryRoutes.rows.find( deliveryRoute => deliveryRoute.name === 'farm' )
    return Postgres.query( `SELECT * FROM membershare WHERE shareid IN ( ${ shares.rows.map( row => row.id ).join(', ') } )` )
} )
.then( result =>
    result.rows.forEach( row => addCsaTransaction( row.shareid, row.id, row.memberid ) )
)
.catch( require( '../lib/MyError' ) )


