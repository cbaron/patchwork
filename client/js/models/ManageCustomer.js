module.exports = Object.assign( {}, require('./__proto__'), {

    Member: require('./Member'),
    Person: require('./Person'),

    parse( response ) {
        return response.map( row => {
            const data = Object.keys( row ).reduce(
                ( memo, key ) => {
                    const index = key.indexOf('.')
                    memo[ key.slice(0, index) ][ key.slice( index + 1 ) ] = row[key]
                    return memo
                },
                { member: {}, person:{} }
            )
            data.person.member = Object.create( this.Member, { data: { value: data.member } } )
            return Object.create( this.Person, { data: { value: data.person } } )
        } )
            
    },

    resource: 'person'

} )
