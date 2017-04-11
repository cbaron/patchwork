module.exports = Object.assign( {}, require('./__proto__'), {

    Pikaday: require('pikaday'),

    Views: {
        buttonFlow: { model: { value: {
            disabled: true,
            states: {
                start: [ { name: 'addTransaction', class: 'save-btn', text: 'Add Transaction', nextState: 'confirm' } ],
                confirm: [
                    { name: 'confirmAdd', class: 'save-btn', text: 'Are you Sure?', emit: true, nextState: 'start' },
                    { name: 'cancel', class: 'reset-btn', nextState: 'start', text: 'Cancel', emit: true }
                ]
            }
        } } }
    },

    addTransaction() {
        return this.model.post( Object.assign(
            { memberShareId: this.memberShareId },
            this.model.attributes.reduce( ( memo, attr ) =>
                Object.assign( memo, { [ attr ]:
                    attr === 'created'
                        ? this.Moment( this.els[attr].value, 'MMM D, YYYY' ).format('YYYY-MM-DD') 
                        : this.els[attr].value
                } ),
                { }
            ) 
        ) )
        .then( () => this.Toast.showMessage( 'success', 'Transaction added!' ) )
        .catch( e => { this.Error(e); this.Toast.showMessage( 'error', 'Error adding transaction' ) } )
    },

    onAddBlur(e) {
        isNaN( parseFloat( this.els.value.value ) )
            ? this.els.form.classList.remove('active')
            : this.views.buttonFlow.enable()
    },

    onAddFocus(e) {
        this.els.form.classList.add('active')
    },

    onCancel() {
        this.reset()
        this.views.buttonFlow.disable()
    },

    postRender() {
        this.model.attributes.forEach( attr => {
            this.els[ attr ].addEventListener( 'focus', e => this.onAddFocus(e) )
            this.els[ attr ].addEventListener( 'blur', e => this.onAddBlur(e) )
        } )

        this.created = new this.Pikaday( { field: this.els.created, format: 'MMM D, YYYY' } )

        this.views.buttonFlow.on( 'confirmAddClicked', e => this.addTransaction() )
        this.views.buttonFlow.on( 'cancelClicked', e => this.onCancel() )

        return this
    },

    reset() {
        const now = this.Moment().format('MMM D, YYYY')
        this.model.attributes.forEach( attr =>
            this.els[ attr ].value =
                attr === 'action'
                    ? this.model.actions[0]
                    : attr === 'created'
                        ? now
                        : '' )

        this.created.setMoment( now )
    },

    templateOpts() {
        return { actions: this.model.actions }
    },

    update( memberShareId ) {
        this.memberShareId = memberShareId
        this.reset()
    }
} )
