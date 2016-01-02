module.exports = {

    attachUserRoles() {
        return this.dbQuery( { query: "SELECT r.name AS name FROM role r JOIN membership m ON m.roleid = r.id WHERE m.personid = $1;", values: [ this.user.id ] } )
            .then( result => this.user.roles = result.rows.map( row => row.name ) )
    }

}
