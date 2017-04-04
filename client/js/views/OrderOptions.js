module.exports = Object.assign( {}, require('./__proto__'), {

    DeliveryOptions: Object.create( require('../models/__proto__'), { resource: { value: 'deliveryoption' } } ),
    GroupDropoffs: Object.create( require('../models/__proto__'), { resource: { value: 'groupdropoff' } } ),
    MemberSelection: require('../models/MemberSelection'),
    OrderOption: require('../models/OrderOption'),
    OrderOptionOptions: Object.create( require('../models/__proto__'), { resource: { value: 'shareoptionoption' } } ),

    clear() {
        this.els.options.innerHTML = ''

        this.els = {
            editSummary: this.els.editSummary,
            changes: this.els.changes,
            container: this.els.container,
            seasonLabel: this.els.seasonLabel,
            options: this.els.options,
            resetBtn: this.els.resetBtn,
            reviewBtn: this.els.reviewBtn
        }
    },

    events: {
        options: 'change',
        resetBtn: 'click',
        reviewBtn: 'click'
    },

    onOptionsChange( e ) {
        const shareOptionKey = e.target.closest('li.editable').getAttribute('data-name'),
              val = e.target.value

        if( shareOptionKey === 'deliveryOption' && val !== 'group' ) this.emit( 'deliveryChanged', { deliveryOption: val } )
        if( shareOptionKey === 'groupOption' && val !== 'none' ) this.emit( 'deliveryChanged', { deliveryOption: 'group', groupOption: val } )

        if( shareOptionKey === 'deliveryOption' && val !== 'group' ) {
            this.els.groupOption.selectedIndex = 0
            this.els.groupOption.disabled = true
            this.els.groupOption.closest('li').classList.remove('edited')
            if( this.editedFields.groupOption ) this.editedFields.groupOption.newValue = undefined
        } else { this.els.groupOption.disabled = false }

        if( this.editedFields[ shareOptionKey ].oldValue === val ) {
            return e.target.closest('li.editable').classList.remove('edited')
        }

        this.editedFields[ shareOptionKey ].newValue = val
        e.target.closest('li.editable').classList.add('edited')

        this.els.resetBtn.classList.remove('hidden')
        this.els.reviewBtn.classList.remove('hidden')
    },

    onResetBtnClick() {
        this.els.resetBtn.classList.add('hidden')
        this.els.reviewBtn.classList.add('hidden')
        this.els.editSummary.classList.add('hidden')
        this.update( this.model )
        this.emit( 'reset', this.model )
    },

    onReviewBtnClick() {
        this.els.changes.innerHTML = ''
        
        this.els.options.querySelectorAll('li.edited').forEach( el => {
            const fieldName = el.getAttribute('data-name'),
                  fieldLabel = this.capitalizeFirstLetter( fieldName ),
                  oldValue = this.editedFields[ fieldName ].oldValue.toString(),
                  newValue = this.editedFields[ fieldName ].newValue.toString()

            this.slurpTemplate( { insertion: { el: this.els.changes }, template: this.templates.fieldEdit( { label: fieldLabel, oldValue, newValue } ) } )

        } )

        this.els.editSummary.classList.remove('hidden')
    },

    onSelectFocus( e ) {
        const shareOptionKey = e.target.closest('li.editable').getAttribute('data-name')

        if( ! this.editedFields[ shareOptionKey ] ) {
            this.editedFields[ shareOptionKey ] = { }
            this.editedFields[ shareOptionKey ].oldValue = e.target.value
        }
    },

    postRender() {
        this.els.options.addEventListener( 'focus', e => this.onSelectFocus( e ), true )
        return this
    },

    renderDeliveryOptions() {
        const option = this.model.delivery.data[0]

        this.slurpTemplate( { template: this.templates[ this.optionTemplate ]( { name: 'Delivery Option', id: 'deliveryOption' } ), insertion: { el: this.els.options } } )
           
        this.slurpTemplate( { template: this.templates[ this.optionTemplate ]( { name: 'Group Option', id: 'groupOption' } ), insertion: { el: this.els.options } } )
            
        if( this.optionTemplate === 'editableOption' ) {

            this.DeliveryOptions.data.forEach( option =>
                this.slurpTemplate( { template: this.templates.selectOption( option ), insertion: { el: this.els.deliveryOption } } )
            )

            this.els.deliveryOption.querySelector(`option[value=${CSS.escape( option.deliveryoption.name )}`).selected = true

            this.GroupDropoffs.data.unshift( { name: 'none', label: 'None' } )
            this.GroupDropoffs.data.forEach( option =>
                this.slurpTemplate( { template: this.templates.selectOption( option ), insertion: { el: this.els.groupOption } } )
            )

            if( ! option.groupdropoff.id ) {
                this.els.groupOption.selectedIndex = 0
                this.els.groupOption.disabled = true
            } else this.els.groupOption.querySelector(`option[value=${CSS.escape( option.groupdropoff.name )}`).selected = true

        } else {
            this.els.deliveryOption.textContent = option.deliveryoption.label
            this.els.groupOption.textContent = option.groupdropoff.label || 'N/A'
        }

        return this
    },

    renderShareOptions() {
        this.OrderOption.data.forEach( shareOption => {
            this.slurpTemplate( { template: this.templates[ this.optionTemplate ]( shareOption ), insertion: { el: this.els.options } } )
            
            if( this.editable ) {
                this.OrderOptionOptions.data.forEach( option => {
                    if( option.shareoptionid === shareOption.id ) this.slurpTemplate( {
                        template: this.templates.selectOption( option ), insertion: { el: this.els[ shareOption.id ] }
                    } )
                } )
            }            
        } )

        this.MemberSelection.data.forEach( selection => {
            this.editable
                ? this.els[ selection.shareoptionid ].querySelector(`option[value=${CSS.escape( selection.name )}`).selected = true
                : this.els[ selection.shareoptionid ].textContent = selection.label
        } )

    },

    templates: {
        fieldEdit: require('./templates/FieldEdit'),
        archivedOption: option => `<li><div class="cell">${option.name}</div><div class="cell" data-js="${option.id}"></div></li>`,
        editableOption: option => `<li data-name="${option.key || option.id}" class="editable"><span>${option.name}</span><select data-js="${option.id}"></select></li>`,
        selectOption: option => `<option value="${option.name}">${option.label}</option>`
    },

    update( { customer, delivery, share } ) {
        this.clear()
        this.editedFields = { }

        this.model = arguments[0]

        this.editable = ( this.Moment() < this.Moment( share.enddate ) )
        this.optionTemplate = this.editable ? 'editableOption' : 'archivedOption'

        this.els.seasonLabel.textContent = share.label

        this.OrderOption.get( { query: { shareid: share.id, shareoptionid: { operation: 'join', value: { table: 'shareoption', column: 'id' } } } } )
        .then( () => this.OrderOptionOptions.get() )
        .then( () => this.MemberSelection.get( { query: { membershareid: share.membershareid, shareoptionoptionid: { operation: 'join', value: { table: 'shareoptionoption', column: 'id' } } } } ) )
        .then( () => this.renderShareOptions() )
        .then( () => this.DeliveryOptions.get() )
        .then( () => this.GroupDropoffs.get() )
        .then( () => this.renderDeliveryOptions().show() )
        .catch( this.Error )

    }

} )
