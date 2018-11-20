module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        'collectionManagerBtn': 'click',
        'manageCustomerBtn': 'click',
        'reportingBtn': 'click',
        'weeklyReminderBtn' : 'click'
    },

    model: {

        manageCustomer: { label: 'Manage Customers', roles: new Set( [ 'admin' ] ), url: 'manage-customer' },

        collectionManager: {
            label: 'Collection Manager',
            roles: new Set( [ 'admin' ] ),
            url: 'collection-manager'
        },

        reporting: { label: '~_~ Reporting ~_~', roles: new Set( [ 'admin' ] ), url: 'reporting' },

        weeklyReminder: { label: 'Weekly Reminder', roles: new Set( [ 'admin' ] ), url: 'weekly-reminder' }
    },

    onCollectionManagerBtnClick() {
        this.emit( 'navigate', 'admin-plus/collection-manager' )
    },

    onManageCustomerBtnClick() {
        this.emit( 'navigate', 'admin-plus/manage-customer' )
    },

    onNavigation( path ) {
        this.path = path

        const key = this.keys.find( key => this.model[ key ].url === path[0] )

        if( key !== undefined ) return this.showView( key )

        Promise.all( Object.keys( this.model ).map( key => {
            const view = this.model[ key ].view
            return view ? view.hide() : Promise.resolve()
        } ) )
        .then( () => { this.currentEl = this.els.nav; return this.showEl( this.els.nav ) } )
        .catch( this.Error )
    },

    onReportingBtnClick() {
        this.emit( 'navigate', 'admin-plus/reporting' )
    },

    onWeeklyReminderBtnClick() {
        this.emit( 'navigate', 'admin-plus/weekly-reminder' )
    },

    postRender() {
        this.keys = Object.keys( this.model )

        this.keys.forEach( ( name, i ) => {
            if( this.user.get('roles').filter( role => this.model[ name ].roles.has( role ) ).length ) {
                this.slurpTemplate( { template: `<button data-js="${name}Btn">${this.model[ name ].label}</button>`, insertion: { el: this.els.nav } } )
            }
        } )

        this.currentEl = this.els.nav

        if( this.path.length > 1 ) this.onNavigation( this.path.slice( 1 ) )

        return this
    },

    showView( key ) {
        return this.hideEl( this.currentEl )
        .then( () => {
            this.model[ key ].view 
                ? this.model[ key ].view.onNavigation( this.path.slice( 1 ) )
                : this.model[ key ].view = this.factory.create( key, { insertion: { el: this.els.views }, path: this.path.slice(1) } )
                    .on( 'navigate', ( route, opts ) => this.emit( 'navigate', route, opts ) )
        
            this.currentView = this.model[ key ].view
            this.currentEl = this.model[ key ].view.getContainer()
            return Promise.resolve()
        } )
        .catch( this.Error )
    },

    requiresLogin: true,

    requiresRole: 'admin'

} )
