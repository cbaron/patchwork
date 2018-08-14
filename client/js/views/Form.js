const Submitter = require('./Submitter')

module.exports = Object.assign( { }, require('./__proto__'), Submitter, {

    Flatpickr: require('flatpickr'),

    events: Object.assign( Submitter.events, { form: 'submit', previewBtn: 'click' } ),

    onPreviewBtnClick( e ) {
        e.target.nextElementSibling.src = this.Format.ImageSrc( e.target.parentElement.previousElementSibling.value )
    },

    clear() {
        this.inputEls.forEach( el => el.value = '' )

        if( this.views ) {
            Object.keys( this.views ).forEach( key => {
                const view = this.views[ key ]

                if( view.itemViews ) {
                    view.itemViews.forEach( itemView => {
                        if( itemView.name !== 'Form' ) return
                        itemView.clear()
                    } )
                } else {
                    if( view.name !== 'Form' ) return
                    view.clear()
                }
            } )
        }
    },

    getElementValue( el, attribute ) {
        if( attribute === undefined || ( !attribute.fk && attribute.range && typeof attribute.range === 'string' ) ) return el.value
    },

    getFormValues() {
        const attributes = this.model.attributes

        let data = this.reducer( Object.keys( this.els ), key =>
            /(INPUT|SELECT|TEXTAREA)/.test( this.els[ key ].tagName )
                ? { [key]: this.getElementValue( this.els[ key ], attributes.find( attribute => attribute.name === key ) ) }
                : { }
        )

        attributes.forEach( attribute => {
            if( attribute.fk ) { data[ attribute.columnName ] = this.views[ attribute.fk ].getSelectedId() }
            else if( attribute.range === 'Geography' ) { data[ attribute.name ] = Array.from( this.els[ attribute.name ].querySelectorAll('input') ).map( el => el.value ) }
            else if( typeof attribute.range === "object" ) { data[ attribute.name ] = this.views[ attribute.name ].getFormValues() }
            else if( attribute.range === "List" ) {
                data[ attribute.name ] = Array.from( this.views[ attribute.name ].els.list.children ).map( itemEl => {
                    const selector = attribute.itemRange === 'Text' ? '.item textarea' : '.item input'
                    return this.getElementValue( itemEl.querySelector( selector ), { range: attribute.itemRange } )
                } )
            }
        } )

        return data
    },

    handleValidationError( attr ) {
        const inputEl = attr.fk ? this.views[ attr.fk ].els.input : this.els[ attr.name ]
        this.Toast.showMessage( 'error', attr.error )
        inputEl.classList.add( 'error' )
        this.onSubmitEnd()
    },

    initTypeAheads() {
        this.model.attributes.forEach( attribute => {
            if( attribute.fk ) this.views[ attribute.fk ].setResource( attribute.fk ).initAutoComplete( this.model.git( attribute.columnName ) )
            else if( attribute.range === 'Time' ) {
                const flatpickr = this.Flatpickr( this.els[ attribute.name ], {
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i"
                } )
            } else if( attribute.range === 'Date' ) {
                const flatpickr = this.Flatpickr( this.els[ attribute.name ], { } )
            } else if( typeof attribute.range === "object" ) {
                this.Views[ attribute.name ] = {
                    disallowEnterKeySubmission: true,
                    model: Object.create( this.Model ).constructor( this.model.data[ attribute.name ], {
                        meta: { isNested: !this.model.meta.isNested, ...this.model.meta },
                        attributes: attribute.range
                    } ),
                    templateOpts: { hideButtonRow: true },
                    Views: { },
                }
                const el = this.els[ attribute.name ]
                delete this.els[ attribute.name ]
                this.subviewElements = [ { el, view: 'form', name: attribute.name } ]
                this.renderSubviews()
            } else if( attribute.range === "List" ) {
                const collectionData = this.model.git( attribute.name ) ? this.model.git( attribute.name ).map( datum => ( { value: datum } ) ) : [ ];

                this.Views[ attribute.name ] = {
                    model: Object.create( this.model ).constructor( {
                        add: true,
                        collection: Object.create( this.Model ).constructor( collectionData, { meta: { key: 'value' } } ),
                        delete: true,
                        isDocumentList: false,
                        draggable: 'listItem'
                    } ),
                    itemTemplate: datum => Reflect.apply( this.Format.GetFormField, this.Format, [ { range: attribute.itemRange }, datum.value, this.model.meta ] )
                }
                const el = this.els[ attribute.name ]
                delete this.els[ attribute.name ]
                this.subviewElements = [ { el, view: 'list', name: attribute.name } ]
                this.renderSubviews()
                this.views[ attribute.name ].on( 'addClicked', () => this.views[ attribute.name ].add( { value: '' } ) )
                this.views[ attribute.name ].on( 'deleteClicked', datum => this.views[ attribute.name ].remove( datum ) )
            }
        } )
    },

    onFormSubmit( e ) { e.preventDefault() },

    postRender() {
        if( this.model.meta.isNested && this.els.container.closest('.form-group') ) this.els.container.closest('.form-group').classList.add('vertical')
        this.inputEls = this.els.container.querySelectorAll('input, select, textarea')

        if( !this.disallowEnterKeySubmission ) this.els.container.addEventListener( 'keyup', e => { if( e.keyCode === 13 ) this.onSubmitBtnClick() } )

        this.inputEls.forEach( el =>
            el.addEventListener( 'focus', () => el.classList.remove('error') )
        )

        if( this.model ){
            this.model.on( 'validationError', attr => this.handleValidationError( attr ) )
            this.initTypeAheads()
            this.key = this.model.meta ? this.model.meta.key : '_id'
        }

        return this 
    },

    submit() {
        if( !this.validate( this.getFormValues() ) ) return Promise.resolve( this.onSubmitEnd() )

        const method = !Boolean( this.model.data[ this.key ]  ) ? 'post' : this.key === 'id' ? 'patch' : 'put'

        return ( method === 'post'
            ? this.model.post()
            : this.model[ method ]( this.model.data[ this.key ], this.omit( this.model.data, [ this.key ] ) )
        )
        .then( () => {
            this.emit( method === 'post' ? 'posted' : 'put', Object.assign( {}, this.model.data ) )
            this.model.data = { }
            this.clear()
            this.Toast.showMessage( 'success', this.toastSuccess || `Success` )
            return Promise.resolve()
        } )
    },

    validate( data ) {
        let valid = true

        if( !this.model.validate( data ) ) valid = false

        if( this.views ) {
            Object.keys( this.views ).forEach( key => {
                const view = this.views[ key ]

                if( view.itemViews ) {
                    view.itemViews.forEach( itemView => {
                        if( itemView.name !== 'Form' ) return
                        if( !itemView.validate( itemView.getFormValues() ) ) valid = false
                    } )
                } else {
                    if( view.name !== 'Form' ) return
                    if( !view.validate( view.getFormValues() ) ) valid = false
                }
            } )
        }

        return valid
    }

} )
