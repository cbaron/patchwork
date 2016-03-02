var BaseResource = require('./__proto__'),
    ValidateAddress = function() {
        this.validator.setOptions( {
            countryBias: "US",
            countryMatch: "US"
        } )
        return BaseResource.apply( this, arguments )
    }

Object.assign( ValidateAddress.prototype, BaseResource.prototype, {

    validator: require('address-validator'),

    GET() {
        BaseResource.prototype.context.GET.call(this)
        return new Promise( ( resolve, reject ) => {
            this.validator.validate( this.query.address, ( err, validAddresses, inexactMatches, geocodingResponse ) => {
                if( err ) return reject( err )
                this.respond( { body: {
                    valid: validAddresses.map( address => ( { string: address.toString(), model: address } ) ),
                    inexact: inexactMatches.map( address => ( { string: address.toString(), model: address } ) )
                } } )
                resolve()
            } )
        } )
    }

} )

module.exports = ValidateAddress
