module.exports = Object.assign( {}, require('./__proto__'), {

    Member: require('./Member'),
    Person: require('./Person'),

    parse( response ) {
        return response.map( row =>
            Object.keys( row ).reduce(
                ( memo, key ) => {
                    const index = key.indexOf('.')
                    memo[ key.slice(0, index) ].data[ key.slice( index + 1 ) ] = row[key]
                    return memo
                },
                { member: Object.create( this.Member, { data: { value: {} } } ),
                  person: Object.create( this.Person, { data: { value: {} } } )
                }
            )
        )
    },

    resource: 'person'

} )
