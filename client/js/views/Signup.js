var MyView = require('./MyView'),
    Signup = function() { return MyView.apply( this, arguments ) }

Object.assign( Signup.prototype, MyView.prototype, {

    events: {
        'rightBtn': { method: 'validateView' },
    },

    instances: { },

    postRender() {
        
        if( ! this.currentIndex ) this.currentIndex = 0

        this.signupData = { }

        return this.showProperView()

    },

    requiresLogin: false,

    showNext() {
        this.instances[ this.views[ this.currentIndex ].name ].hide()

        this.currentIndex += 1

        this.showProperView()
    },

    showProperNav() {
        var left = this.templateData.leftBtn, right = this.templateData.rightBtn
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

    showProperView() {
        var currentViewName = this.views[ this.currentIndex ].name

        this.showProperNav()

        if( this.instances[ currentViewName ] ) return this.instances[ currentViewName ].show()

        this.instances[ currentViewName ] =
            new this.views[ this.currentIndex ].view( {
                container: this.templateData.walkthrough,
                signupData: this.signupData 
            } )

        return this
    },

    template: require('../templates/signup')( require('handlebars') ),

    validateView() {
        var view = this.instances[ this.views[ this.currentIndex ].name ]

        this.Q.when( view.validate() ).then( result => {
            if( result ) this.showNext()
        } )
        .fail( e => new this.Error(e) )
        .done()
    },

    views: [
        { name: 'shares', view: require('./signup/Shares') },
        { name: 'memberInfo', view: require('./signup/MemberInfo') },
        { name: 'shareOptions', view: require('./signup/ShareOptions') },
        { name: 'delivery', view: require('./signup/Delivery') },
        { name: 'dateSelection', view: require('./signup/DateSelection') }
    ]

} )

module.exports = Signup
