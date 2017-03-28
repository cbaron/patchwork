#!/usr/bin/env node

require('node-env-file')( __dirname + '/../.env' );

const Postgres = require('../dal/postgres'),
    Moment: require('moment')

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

const determineDates( dayOfWeek ) {
    const dates = [ ]

    if( ! Number.isInteger( dayOfWeek ) ) throw Error("No Day Of Week")

    const now = this.Moment(),
        nextWeek = ( now.day() === 6 || ( now.day() === 5 && now.hour() > 5 ) )
            ? this.Moment().day(15).hour(0).minute(0).second(0).millisecond(0)
            : this.Moment().day(8).hour(0).minute(0).second(0).millisecond(0),
        endDate = this.Moment( this.model.share.enddate )
        
    let deliveryDate = this.Moment( this.model.share.startdate ),
        startDay = deliveryDate.day()

    while( startDay != dayOfWeek ) {
        deliveryDate.add( 1, 'days' )
        startDay = this.Moment( deliveryDate ).day()
    }
    
    while( endDate.diff( deliveryDate, 'days' ) >= 0 ) {
        this.dates.push( { date: this.Moment( deliveryDate ), unselectable: Boolean( deliveryDate.diff( nextWeek ) < 0 ) } )
        deliveryDate.add( 7, 'days' )
    }

    return this
}
  
const addCsaTransaction = ( shareId, memberShareId, memberId ) => {
    let weeklyTotal = 0

    return Postgres.query( `SELECT * FROM membershareoption WHERE membershareid = ${memberShareId}` )
    .then( result => {
        result.rows.forEach( option => weeklyTotal += shareOptionOptionsById[ option.shareoptionoptionid ].price.replace( /\$|,/g, "" ) )
        return Postgres.query( `SELECT * FROM membersharedelivery WHERE membershareid = ${memberShareId}` )
    } )
    .then( result => {
        weeklyTotal += deliveryOptionsById[ result.rows[0].deliveryoptionid ].price.replace( /\$|,/g, "" )
        return getDayOfWeek( result.rows[0], shareId, memberId )
    } )
    .then( dayOfWeek =>
        const dayOfWeek = getDayOPromise.resolve( weeklyTotal += deliveryOptionsById[ result.rows[0].deliveryoptionid ].price.replace( /\$|,/g, "" ) ) )


}

Promise.all( [
    Postgres.query( `SELECT * FROM share WHERE startdate > '2017-01-01'` ),
    Postgres.query( `SELECT * FROM shareoptionoption` ),
    Postgres.query( `SELECT * FROM deliveryoption` ),
    Postgres.query( `SELECT * FROM deliveryroute` ),
.then( ( [ shares, shareOptionOptions, deliveryOptions, deliveryRoutes ] ) => {
    sharesById = shares.rows.reduce( ( memo, share ) => Object.assign( memo, { [ share.id ]: share } ), { } )
    shareOptionOptionsById = shareOptionOptions.rows.reduce( ( memo, shareOptionOption ) => Object.assign( memo, { [ shareOptionOption.id ]: shareOptionOption } ), { } )
    deliveryOptionsById = deliveryOptions.rows.reduce( ( memo, deliveryOption ) => Object.assign( memo, { [ deliveryOption.id ]: deliveryOption } ), { } )
    deliveryRoutesById = deliveryRoutes.rows.reduce( ( memo, deliveryRoute ) => Object.assign( memo, { [ deliveryRoute.id ]: deliveryRoute } ), { } )
    farmRoute = deliveryRoutes.rows.find( deliveryRoute => deliveryRoute.name === 'farm' )
    return Postgres.query( `SELECT * FROM membershare WHERE shareid IN ( ${ result.rows.map( row => row.id ).join(', ') } )` )
} )
.then( result =>
    result.rows.forEach( row => addCsaTransaction( row.shareid, row.id, row.memberid ) )
)
.catch( require( '../lib/MyError' ) )


