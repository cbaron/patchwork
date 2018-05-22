const AdminOnly = new Set( [ 'admin' ] )

module.exports = {

    Collection: {
        GET: AdminOnly,
        DELETE: AdminOnly,
        POST: AdminOnly
    },

    'customer-login': {
        PATCH: AdminOnly
    },

    Document: {
        PATCH: AdminOnly
    }

}
