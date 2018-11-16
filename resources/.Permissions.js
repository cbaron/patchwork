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

    'delete-order': {
        DELETE: AdminOnly
    },

    Document: {
        PATCH: AdminOnly
    },

    'weekly-reminder': {
        GET: AdminOnly,
        POST: AdminOnly
    }

}
