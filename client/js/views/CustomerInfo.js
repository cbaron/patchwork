module.exports = Object.assign( {}, require('./__proto__'), {

    MemberFoodOmission: require('../models/MemberFoodOmission'),

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
              field = this.fields.find( field => field.name === el.getAttribute('data-name') ),
              fieldValue = el.textContent.trim(),
              modelValue = this.model[ field.table ].data[ field.name ] || ''

        if( fieldValue !== modelValue ) {
            el.classList.add('edited')
            this.editedFields[ field.name ] = fieldValue || null
            this.showEditSummary()
            this.emit( 'edited' )
        } else if( this.editedFields[ field.name ] !== undefined ) {
            el.classList.remove('edited')
            this.editedFields[ field.name ] = undefined
            this.showEditSummary()
        }
    },

    hasEdits() {
        return Object.keys( this.editedFields ).filter( key => this.editedFields[ key ] !== undefined ).length > 0
    },

    handleEdit( e ) { this.els.resetBtn.classList.remove('fd-hidden') },

    handleOmissionChange( e, m ) {
        const values = m.val(),
            name = values.length ? m.val()[0].name : '',
            originalName = this.MemberFoodOmission.data.length ? this.MemberFoodOmission.data[0].name : ''
       
        if( originalName !== name ) {
            this.editedFields.neverReceive = name
            this.emit('edited')
            this.showEditSummary()
        } else if( this.editedFields.neverReceive !== undefined ) {
            this.editedFields.neverReceive = undefined
            this.showEditSummary()
        }
    },

    onOnPaymentPlanChange( e ) {
        const el = e.target,
            fieldValue = Boolean( el.value === "true" ),
            modelValue = this.model.member.data.onPaymentPlan

        if( modelValue !== fieldValue ) {
            el.classList.add('edited')
            this.editedFields[ 'onPaymentPlan' ] = Boolean( el.value === "true" )
            this.emit('edited')
            this.showEditSummary()
        } else if( this.editedFields.onPaymentPlan !== undefined ) {
            el.classList.remove('edited')
            this.editedFields.onPaymentPlan = undefined
            this.showEditSummary()
        }
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
            this.els.resetBtn.classList.add('fd-hidden')
            this.els.editSummary.classList.add('fd-hidden')

            this.Toast.showMessage( 'success', 'Customer Info Updated!' )
            this.update( this.model )
        } )
        .catch( this.Error )
    },

    populateTable() {
        this.fields.forEach( field => {
            if( field.type !== 'select' ) this.els[ field.name ].textContent = this.model[ field.table ].data[ field.name ]
        } )

        if( this.MemberFoodOmission.data.length ) {
            const datum = this.MemberFoodOmission.data[0],
                index = this.FoodOmission.Foods.data.findIndex( food => food.produceid === datum.produceid || food.producefamilyid === datum.producefamilyid )

            if( index !== -1 ) {
                const foodDatum = this.FoodOmission.Foods.data[ index ]
                datum.name = foodDatum.name
                this.FoodOmission.ms.setSelection( [ Object.assign( {}, foodDatum, { id: index } ) ] )
            }
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
        } )

        this.on( 'edited', e => this.handleEdit( e ) )

        return this
    },

    reset( customer ) {
        this.els.resetBtn.classList.add('fd-hidden')
        this.els.editSummary.classList.add('fd-hidden')
        this.update( customer )
    },

    showEditSummary() {
        const hasEdits = this.hasEdits()

        this.els.changes.innerHTML = ''
        
        this.fields.forEach( field => {
            if( this.editedFields[ field.name ] !== undefined ) {
                let oldValue = ( field.name === 'neverReceive' )
                    ? this.MemberFoodOmission.data.length ? this.MemberFoodOmission.data[0].name : ''
                    : this.model[ field.table ].data[ field.name ]
                let newValue = this.editedFields[ field.name ]

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

        this.els.resetBtn.classList.toggle( 'fd-hidden', !hasEdits )
        this.els.editSummary.classList.toggle( 'fd-hidden', !hasEdits )
    },

    Templates: {
        fieldEdit: require('./templates/FieldEdit')
    },
    
    update( customer ) {
        this.clear()

        this.model = customer
        this.editedFields = { }

        return this.MemberFoodOmission.get( { query: { memberid: customer.member.data.id } } )
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
        let msData = this.FoodOmission.Foods.data.find( datum => datum.name == this.memberFoodOmissionData.neverReceive ) || 
            method = this.MemberFoodOmission.data[0].id ? 'PATCH' : 'POST',
            data = { memberid: this.model.member.data.id, produceid: msData.produceid, producefamilyid: msData.producefamilyid },
            opts = { method: method, resource: 'memberfoodomission', data: JSON.stringify( data ) }

        if( method === 'PATCH' ) opts['id'] = this.MemberFoodOmission.data[0].id

        return this.Xhr( opts )
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
