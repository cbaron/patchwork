module.exports = {

    attachUserRoles() {
        return this.dbQuery( { query: "SELECT r.name AS name FROM role r JOIN personrole m ON m.roleid = r.id WHERE m.personid = $1;", values: [ this.user.id ] } )
            .then( result => this.user.roles = result.rows.map( row => row.name ) )
    },

    createToken() {
        return new Promise( ( resolve, reject ) => {
            require('jws').createSign( {
                header: { "alg": "HS256", "typ": "JWT" },
                payload: JSON.stringify( this.user ),
                privateKey: process.env.JWS_SECRET,
            } )
            .on( 'done', signature => resolve( signature ) )
            .on( 'error', e => { this.user = { }; return resolve() } )
        } )
    },

    respondSetCookie( token, body ) {
        var now = new Date()
        now.setTime( now.getTime() + 1000 * 86400 * 30 )
        this.respond( { body, headers: { 'Set-Cookie': this.format( 'patchworkjwt=%s;expires=%s;', token, now.toGMTString() ) } } )
    }

}
