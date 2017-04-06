module.exports = Object.assign( {}, require('./__proto__'), {

    clear() {
        this.fields.forEach( field => {
            if( field.type !== 'select' ) this.els[ field.name ].textContent = ''
        } )

        this.els.infoTable.querySelectorAll('.edited').forEach( el => el.classList.remove('edited') )

        this.FoodOmission.clear()
    },

    events: {
        onPaymentPlan: 'change',
        resetBtn: 'click',
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
            this.editedFields[ field.name ] = el.textContent.trim() || null
            this.showEditSummary()
        }
    },

    handleEdit( e ) { this.els.resetBtn.classList.remove('hidden') },

    handleOmissionChange( e, m ) {
        if( ! m.val().length ) return

        if( this.models.neverReceive.data.neverReceive !== m.val()[0].name ) {
            this.editedFields.neverReceive = m.val()
            this.emit('edited')
            this.showEditSummary()
        }
    },

    models: {
        neverReceive: require('../models/NeverReceive')
    },

    onOnPaymentPlanChange( e ) {
        const el = e.target

        el.classList.add('edited')
        this.editedFields[ 'onPaymentPlan' ] = ( el.value === "true" )
        this.emit('edited')
        this.showEditSummary()
    },

    onResetBtnClick() { this.reset( this.model ) },

    onSaveBtnClick() {
        const resourcesToUpdate = [ ]

        this.memberData = { }
        this.personData = { }
        this.memberFoodOmissionData = { }

        this.fields.forEach( field => {
            if( this.editedFields[ field.name ] !== undefined ) {
                this[ `${field.table}Data` ][ field.name ] = this.editedFields[ field.name ]
                if( resourcesToUpdate.indexOf( field.table ) === -1 ) resourcesToUpdate.push( field.table )
            }
        } )

        return Promise.all( resourcesToUpdate.map( resource => this[ `update${resource.charAt(0).toUpperCase() + resource.slice(1)}` ]() ) )
        .then( () => {            
            this.els.resetBtn.classList.add('hidden')
            this.els.editSummary.classList.add('hidden')

            this.Toast.showMessage( 'success', 'Customer Info Updated!' )
            this.update( this.model )
        } )
        .catch( this.Error )
    },

    populateTable() {
        this.fields.forEach( field => {
            if( field.type !== 'select' ) this.els[ field.name ].textContent = this.model[ field.table ].data[ field.name ]
        } )

        if( this.models.neverReceive.data.neverReceive ) {
            this.FoodOmission.setPlaceholder( this.models.neverReceive.data.neverReceive )
        }

        this.els.onPaymentPlan.selectedIndex = this.model.member.data.onPaymentPlan ? 0 : 1
    },

    postRender() {

        this.FoodOmission = this.factory.create( 'foodOmission', { insertion: { value: { el: this.els.neverReceive, method: 'after' } } } )

        this.els.neverReceive.remove()

        this.FoodOmission.initializeFoodOmission()
        .then( () => {
            this.FoodOmission.removeHelperText()
            this.FoodOmission.unstyle()

            this.FoodOmission.on( 'selectionChange', ( e, m ) => this.handleOmissionChange( e, m ) )
        } )

        this.els.infoTable.querySelectorAll('div[contenteditable=true]').forEach( el => {
            el.addEventListener( 'blur', e => this.handleBlur(e) )
            el.addEventListener( 'input', () => this.emit('edited') )
        } )

        this.on( 'edited', e => this.handleEdit( e ) )

        return this
    },

    reset( customer ) {
        this.els.resetBtn.classList.add('hidden')
        this.els.editSummary.classList.add('hidden')
        this.update( customer )
    },

    showEditSummary() {
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

                if( field.name === 'onPaymentPlan' ) {
                    oldValue = oldValue.toString()
                    newValue = newValue.toString()
                }

                if( oldValue === 'EMPTY' && newValue === 'EMPTY' ) return

                this.slurpTemplate( { insertion: { el: this.els.changes }, template: this.Templates.fieldEdit( { label: field.label, oldValue, newValue } ) } )
            }
        } )

        this.els.editSummary.classList.remove('hidden')
    },

    Templates: {
        fieldEdit: require('./templates/FieldEdit')
    },
    
    update( customer ) {
        this.clear()

        this.model = customer
        this.editedFields = { }

        return this.models.neverReceive.get( { resource: `never-receive/${customer.member.data.id}` } )
        .then( () => this.populateTable() )
        .then( () => this.show() )
        .catch( this.Error )
    },

    updateMember() {
        return this.Xhr( { method: 'PATCH', id: this.model.member.data.id, resource: 'member', data: JSON.stringify( this.memberData ) } )
        .then( () =>
            Promise.resolve(
                Object.keys( this.memberData ).forEach( field => this.model.member.data[ field ] = this.memberData[ field ] )
            )
        )
    },

    updateMemberFoodOmission() {
        let msData = this.memberFoodOmissionData.neverReceive[0],
            method = this.models.neverReceive.data.id ? 'PATCH' : 'POST',
            data = { memberid: this.model.member.data.id, produceid: msData.produceid, producefamilyid: msData.producefamilyid },
            opts = { method: method, resource: 'memberfoodomission', data: JSON.stringify( data ) }

        if( method === 'PATCH' ) opts['id'] = this.models.neverReceive.data.id

        return this.Xhr( opts )
        .then( () =>
            Promise.resolve(
                this.models.neverReceive.data.neverReceive = this.memberFoodOmissionData.neverReceive[0].name
            )
        )
    },

    updatePerson() {
        return this.Xhr( { method: 'PATCH', id: this.model.person.data.id, resource: 'person', data: JSON.stringify( this.personData ) } )
        .then( () =>
            Promise.resolve(
                Object.keys( this.personData ).forEach( field => this.model.person.data[ field ] = this.personData[ field ] )
            )
        )
    }

} )
