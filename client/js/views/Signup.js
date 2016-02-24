var MyView = require('./MyView'),
    Signup = function() { return MyView.apply( this, arguments ) }

Object.assign( Signup.prototype, MyView.prototype, {

    done() {
        this.templateData.leftBtn.hide()
        this.templateData.rightBtn.hide()
    },

    events: {
        'leftBtn': { method: 'goBack' },
        'rightBtn': { method: 'validateView' },
    },
    
    goBack() {
        this.templateData.leftBtn.off()

        this.instances[ this.views[ this.currentIndex ].name ].hide()
        this.instances[ this.views[ this.currentIndex ].name ].templateData.container.removeClass('slide-in-left').removeClass('slide-in-right')

        this.currentIndex -= 1

        this.state.signup.index = this.currentIndex
        this.saveState()

        this.showProperView( true )

        window.setTimeout( () => this.delegateEvents( 'leftBtn', this.templateData.leftBtn ), 1000 )
    },

    instances: { },

    noShares() {
        this.templateData.leftBtn.hide()
        this.templateData.rightBtn.hide()

        this.instances.shares.templateData.header.text('There are no shares available at this time')
    },

    postRender() {

        this.signupData = { }

        this.state = JSON.parse( this.user.get('state') )

        if( this.state.signup ) return this.updateState( this.state.signup )

        if( ! this.currentIndex ) this.currentIndex = 0
        this.state.signup = { index: this.currentIndex, shares: [ ] }
        this.showProperView()
    },

    requiresLogin: false,

    saveState() {
        this.$.ajax( {
            data: JSON.stringify( { state: JSON.stringify( this.state ) } ),
            method: "PATCH",
            url: "/user" } )
        .done()
        .fail( e => new this.Error(e) )
    },

    showNext() {
        this.instances[ this.views[ this.currentIndex ].name ].hide()
        this.instances[ this.views[ this.currentIndex ].name ].templateData.container.removeClass('slide-in-left').removeClass('slide-in-right')

        this.currentIndex += 1
        
        this.state.signup.index = this.currentIndex
        this.state.signup.shares = this.signupData.shares.toJSON()
        this.saveState()

        this.showProperView()
    },

    showProperNav() {
        var left = this.templateData.leftBtn, right = this.templateData.rightBtn

        if( this.currentIndex > 0 ) this.templateData.intro.text('Continue your CSA sign-up')

        if( this.currentIndex === 0 ) {
            left.hide()
            if( right.is(':hidden') ) right.show()
        }
        else if( this.currentIndex === this.views.length - 1 ) {
            right.hide()
            if( left.is(':hidden') ) left.show()
        } else {
            if( left.is(':hidden') ) left.show()
            if( right.is(':hidden') ) right.show()
        }
    },

    showProperView( back ) {
        var currentViewName = this.views[ this.currentIndex ].name,
            klass = this.util.format('slide-in-%s', ( back ) ? 'left' : 'right' )

        this.showProperNav()
        
        if( this.instances[ currentViewName ] ) return this.instances[ currentViewName ].show().templateData.container.addClass(klass)
        
        this.instances[ currentViewName ] =
            new this.views[ this.currentIndex ].view( {
                container: this.templateData.walkthrough,
                signupData: this.signupData
            } )
        
        this.instances[ currentViewName ].templateData.container.addClass(klass)

        if( this.views[ this.currentIndex ].on ) {
            this.views[ this.currentIndex ].on.forEach( eventData =>
                this.instances[ currentViewName ].on( eventData.event, () => this[ eventData.method ]() ) )
        }
        
        return this
    },

    template: require('../templates/signup')( require('handlebars') ),

    updateState( data ) {
        this.currentIndex = data.index

        this.instances.shares = new this.views[0].view( {
            container: this.templateData.walkthrough,
            sessionShares: data.shares,
            signupData: this.signupData
        } ).on( 'initialized', () => this.showProperView() )
        
        this.instances.shares.hide()
    },

    validateView() {
        var view = this.instances[ this.views[ this.currentIndex ].name ]
        
        this.templateData.rightBtn.off()

        this.Q.when( view.validate() ).then( result => { if( result ) this.showNext() } )
        .fail( e => new this.Error(e) )
        .done( () => window.setTimeout( () => this.delegateEvents( 'rightBtn', this.templateData.rightBtn ), 1000 ) )
    },

    views: [
        { name: 'shares', view: require('./signup/Shares'), on: [ { event: 'noShares', method: 'noShares' } ] },
        { name: 'memberInfo', view: require('./signup/MemberInfo') },
        { name: 'shareOptions', view: require('./signup/ShareOptions') },
        { name: 'delivery', view: require('./signup/Delivery') },
        { name: 'dateSelection', view: require('./signup/DateSelection') },
        { name: 'summary', view: require('./signup/Summary'), on: [ { event: 'done', method: 'done' } ] }
    ]

} )

module.exports = Signup
