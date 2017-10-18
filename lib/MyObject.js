var MyObject = function( data ) { return Object.assign( this, data ) }

Object.assign( MyObject.prototype, {

    Error: require('./MyError'),

    _: require('underscore'),

    format: require('util').format,

    moment: require('moment'),

    capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),

    getIntRange( int ) {
        return Array.from( Array( int ).keys() )
    },

    getRandomInclusiveInteger( min, max ) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    },

    omit( obj, keys ) {
        return Object.keys( obj ).filter( key => !keys.includes( key ) ).reduce( ( memo, key ) => Object.assign( memo, { [key]: obj[key] } ), { } )
    },

    pick( obj, keys ) {
        return keys.reduce( ( memo, key ) => Object.assign( memo, { [key]: obj[key] } ), { } )
    },

    reducer( arr, fn ) { return arr.reduce( ( memo, item, i ) => Object.assign( memo, fn( item, i ) ), { } ) },

    shuffleArray( arr ) {
        const rv = Array.from( arr )
       
        rv.forEach( ( item, i ) => {
            if( i === rv.length - 1 ) return 
            const int = this.getRandomInclusiveInteger( i, rv.length - 1 ),
                holder = rv[ i ]

            rv[i] = rv[int]
            rv[int] = holder
        } )

        return rv
    },

    P: ( fun, args=[ ], thisArg ) =>
        new Promise( ( resolve, reject ) => Reflect.apply( fun, thisArg || this, args.concat( ( e, ...callback ) => e ? reject(e) : resolve(callback) ) ) ),

    Q: require('q')
    
} )

module.exports = MyObject
