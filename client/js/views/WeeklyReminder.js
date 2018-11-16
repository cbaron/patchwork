module.exports = { ...require('./__proto__'),

    events: {
        listSelect: 'change',
        viewBtn: 'click',
        rows: 'click',
        sendEmailBtn: 'click',
        upload: 'change'
    },

    model: require('../models/WeeklyReminder'),

    Spinner: require('../plugins/spinner.js'),

    clearTable() {
        this.removeChildren( this.els.columns )
        this.removeChildren( this.els.rows )
    },

    handleColumns( rows ) {
        this.model.metadata.columns.forEach( column => this.slurpTemplate( {
            template: `<li>${column.label}</li>`,
            insertion: { el: this.els.columns }
        } ) )
    },

    handleRows( rows ) {
        const template = rows.map( row => {
            const className = row.isSkipping ? 'isSkipping' : ''
            const columns = this.model.metadata.columns.map( column => `<li>${row[column.name] || ''}</li>` ).join('')
            return `<ol data-id="${row.memberShareId}" class="${className}">${this.Format.GetIcon('minus')}${this.Format.GetIcon('plus')}${columns}</ol>`
        } ).join('')

        this.slurpTemplate( { template, insertion: { el: this.els.rows } } )
    },

    noResults() {
        this.els.empty.classList.remove('fd-hidden')
    },

    onListSelectChange( e ) {
        this.selectedCategory = e.target.value
        this.selectedCategoryEl.parentNode.classList.add('fd-hidden')
        this.selectedCategoryEl = this.els[ `${e.target.value}Select` ]
        this.selectedCategoryEl.parentNode.classList.remove('fd-hidden')
    },

    onRowsClick( e ) {
        const svgEl = e.target.closest('SVG')
        if( !svgEl ) return

        const row = e.target.closest('OL')
        const datum = this.model.data.find( datum => datum.memberShareId == row.getAttribute('data-id') )

        row.classList.toggle('isSkipping')
        datum.isSkipping = row.classList.contains('isSkipping')
        console.log( datum.isSkipping )
    },

    async onSendEmailBtnClick() {
        console.log( 'onSendEmailBtn' )
        console.log( this.isSubmitting )
        if( this.isSubmitting ) return
        this.isSubmitting = true
        this.spinner.spin()
        this.els.sendEmailBtn.appendChild( this.spinner.el )
        console.log( this.els.upload.files[0] )
        console.log( this.model.data.length )
        const emailList = this.model.data.filter( datum => !datum.isSkipping )
        console.log( emailList.length )
        console.log( this.model.data )
        const emails = this.model.sortIntoEmails( emailList )
        console.log( emails )

        const response = await this.Xhr( { method: 'post', resource: 'weekly-reminder', data: JSON.stringify( { emails, attachment: this.model.attachment } ) } )
        console.log( response )
        this.isSubmitting = false
        this.spinner.stop()
        return response.error ? this.Toast.showMessage( 'error', response.error ) : this.Toast.showMessage( 'success', 'Emails sent!' )
    },

    onUploadChange() {
        const file = this.els.upload.files[0]
        const reader = new FileReader()

        reader.addEventListener( 'load', () => {
            console.log( 'ready' )
            const base64String = reader.result.slice( reader.result.indexOf('base64') + 7 )

            this.model.attachment = {
                content: base64String,
                filename: file.name,
                type: file.type,
                disposition: 'attachment'
            }

        } )

        reader.readAsDataURL( file )
    },

    async onViewBtnClick() {
        await this.model.get( { query: { category: this.selectedCategory, selection: this.selectedCategoryEl.value } } )

        this.clearTable()

        if( this.model.data.length == 0 ) return this.noResults()
    
        this.els.empty.classList.add('fd-hidden')

        await Promise.all( this.model.data.map( customer => this.model.getSkipWeekStatus( customer ) ) )

        this.handleColumns( this.model.data )
        this.handleRows( this.model.data )

        this.els.sendEmailBtn.parentNode.classList.remove('fd-hidden')
        this.slideIn( this.els.sendEmailBtn.parentNode, 'right' )
        this.slideIn( this.els.results, 'right' )
    },

    postRender() {
        Promise.all( [ this.model.ContactInfo.get(), this.model.CurrentGroups.get(), this.model.DeliveryRoute.get( { query: { label: 'farm' } } ) ] )
        .then( () => {
            this.slurpTemplate( {
                insertion: { el: this.els.daySelect },
                template: this.model.getDayOptions()
            } )

            this.slurpTemplate( {
                insertion: { el: this.els.singleGroupSelect },
                template: this.model.getGroupNameOptions()
            } )

            this.selectedCategory = 'day'
            this.selectedCategoryEl = this.els.daySelect

            this.spinner = new this.Spinner( {
                color: '#fff',
                lines: 7,
                length: 2,
                radius: 14,
                scale: 0.5
            } )
        } )
        .catch( this.Error )

        return this
    }

}