module.exports = Object.assign( {}, require('./__proto__'), {

    clear() {
        this.fields.forEach( field => {
            if( field.type !== 'select' ) this.els[ field.name ].textContent = ''
        } )

        this.ms.clear()
    },

    events: {
        onPaymentPlan: 'change',
        resetBtn: 'click',
        reviewBtn: 'click',
        saveBtn: 'click'
    },

    fields: [
        { table: 'person', type: 'text', name: 'name', label: 'Name' },
        { table: 'person', type: 'text', name: 'email', label: 'Email' },
        { table: 'person', type: 'text', name: 'secondaryEmail', label: 'Secondary Email' },
        { table: 'member', type: 'text', name: 'phonenumber', label: 'Phone' },
        { table: 'member', type: 'text', name: 'address', label: 'Address' },
        { table: 'memberFoodOmission', type: 'select', name: 'neverReceive', label: 'Vegetable to Never Receive' },
        { table: 'member', type: 'select', name: 'onPaymentPlan', label: 'On Payment Plan' }
    ],

    getTemplateOptions() {
        return { fields: this.fields }
    },

    handleBlur( e ) {
        const el = e.target,
              field = this.fields.find( field => field.name === el.getAttribute('data-name') )

        if( el.textContent !== this.model[ field.table ].data[ field.name ] ) {
            el.classList.add('edited')
            this.editedFields[ field.name ] = el.textContent
            if( this.editedFields[ field.name ] === '' ) this.editedFields[ field.name ] = null
        }
    },

    handleEdit( e ) {
        this.els.resetBtn.classList.remove('hidden')
        this.els.reviewBtn.classList.remove('hidden')        
    },

    handleOmissionChange( e, m ) {
        if( ! m.val().length ) return

        if( this.models.neverReceive.data.neverReceive !== m.val()[0].name ) {
            this.editedFields.neverReceive = m.val()
            this.emit('edited')
        }

    },

    models: {
        memberFoodOmission: require('../models/MemberFoodOmission'),
        neverReceive: require('../models/NeverReceive')
    },

    onOnPaymentPlanChange( e ) {
        const el = e.target

        el.classList.add('edited')
        this.editedFields[ 'onPaymentPlan' ] = el.value
        this.emit('edited')
    },

    onResetBtnClick() {
        this.update( this.model )
    },

    onReviewBtnClick() {
        this.els.changes.innerHTML = ''
        
        this.fields.forEach( field => {
            if( Object.keys( this.editedFields ).indexOf( field.name ) !== -1 ) {
                let oldValue = ( field.name === 'neverReceive' )
                    ? this.models.neverReceive.data.neverReceive
                    : this.model[ field.table ].data[ field.name ]
                let newValue = ( field.name === 'neverReceive' )
                    ? this.editedFields.neverReceive[0].name
                    : this.editedFields[ field.name ]

                if( ! oldValue && field.name !== 'onPaymentPlan' ) oldValue = 'EMPTY'
                if( ! newValue && field.name !== 'onPaymentPlan' ) newValue = 'EMPTY'

                if( oldValue === 'EMPTY' && newValue === 'EMPTY' ) return

                this.slurpTemplate( { insertion: { el: this.els.changes }, template: this.Templates.fieldEdit( { label: field.label, oldValue, newValue } ) } )
            }
        } )

        this.els.editSummary.classList.remove('hidden')
    },

    onSaveBtnClick() {
        const resourcesToUpdate = [ ]

        this.memberData = { }
        this.personData = { }
        this.memberFoodOmissionData = { }

        this.fields.forEach( field => {
            if( this.editedFields[ field.name ] || this.editedFields[ field.name ] === null ) {
                this[ `${field.table}Data` ][ field.name ] = this.editedFields[ field.name ]
                if( resourcesToUpdate.indexOf( field.table ) === -1 ) resourcesToUpdate.push( field.table )
            }
        } )

        return Promise.all( resourcesToUpdate.map( resource => this[ `update${resource.charAt(0).toUpperCase() + resource.slice(1)}` ]() ) )
        .then( () => {            
            this.els.resetBtn.classList.add('hidden')
            this.els.reviewBtn.classList.add('hidden')
            this.els.editSummary.classList.add('hidden')
            document.querySelectorAll('.edited').forEach( el => el.classList.remove('edited') )

            this.Toast.show( 'success', 'Customer Info Updated!' )
            this.update( this.model )
        } )
        .catch( this.Error )
    },

    updateMember() {
        return this.Xhr( { method: 'PATCH', id: this.model.member.data.id, resource: 'member', data: JSON.stringify( this.memberData ) } )
        .then( response => {
            Object.keys( this.memberData ).forEach( field => this.model.member.data[ field ] = this.memberData[ field ] )
            return Promise.resolve()
        } )

    },

    updatePerson() {
        return this.Xhr( { method: 'PATCH', id: this.model.person.data.id, resource: 'person', data: JSON.stringify( this.personData ) } )
        .then( response => {
            Object.keys( this.personData ).forEach( field => this.model.person.data[ field ] = this.personData[ field ] )
            return Promise.resolve()
        } )
    },

    updateMemberFoodOmission() {
        let msData = this.memberFoodOmissionData.neverReceive[0],
            method = this.models.memberFoodOmission.data.length ? 'PATCH' : 'POST',
            data = { memberid: this.model.member.data.id, produceid: msData.produceid, producefamilyid: msData.producefamilyid },
            opts = { method: method, resource: 'memberfoodomission', data: JSON.stringify( data ) }

        if( method === 'PATCH' ) opts['id'] = this.models.memberFoodOmission.data[0].id

        return this.Xhr( opts )
        .then( response => {
            this.models.neverReceive.data.neverReceive = this.memberFoodOmissionData.neverReceive[0].name
            return Promise.resolve()
        } )
    },

    populateTable() {
        this.fields.forEach( field => {
            if( field.type !== 'select' ) this.els[ field.name ].textContent = this.model[ field.table ].data[ field.name ]
        } )

        if( this.models.neverReceive.data.neverReceive ) {
            this.ms.input.attr( 'placeholder', this.models.neverReceive.data.neverReceive )
        }

        let paymentPlan = this.model.member.data.onPaymentPlan
        
        paymentPlan = paymentPlan + ''
        this.els.onPaymentPlan.selectedIndex = paymentPlan == "true" ? 0 : 1
    },

    postRender() {

        this.FoodOmission = this.factory.create( 'foodOmission', { insertion: { value: { el: this.els.neverReceive, method: 'after' } } } )

        this.els.neverReceive.remove()

        this.FoodOmission.initializeFoodOmission()
        .then( () => {
            this.ms = this.FoodOmission.omission

            this.ms.container.removeClass('form-control')
            this.ms.container.addClass('cell')
            this.ms.helper[0].remove()

            this.FoodOmission.$(this.ms).on( 'selectionchange', ( e, m ) => this.handleOmissionChange( e, m ) )

        } )

        document.querySelectorAll('div[contenteditable=true]').forEach( el => {
            el.addEventListener( 'blur', e => this.handleBlur(e) )
            el.addEventListener( 'input', () => this.emit('edited') )
        } )

        this.on( 'edited', e => this.handleEdit( e ) )

        return this
    },

    Templates: {
        fieldEdit: require('./templates/FieldEdit')
    },
    
    update( customer ) {
        this.clear()

        this.model = customer
        this.editedFields = { }

        return this.models.neverReceive.get( { resource: `never-receive/${customer.member.data.id}` } )
        .then( () => this.models.memberFoodOmission.get( { query: { memberid: customer.member.data.id } } ) )
        .then( () => this.populateTable() )
        .then( () => this.show() )
        .catch( this.Error )
    }

} )
