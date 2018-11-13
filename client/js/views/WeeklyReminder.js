module.exports = { ...require('./__proto__'),

    events: {
        listSelect: 'change',
        viewBtn: 'click',
        rows: 'click',
        sendEmailBtn: 'click'
    },

    model: require('../models/WeeklyReminder'),

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

    onSendEmailBtnClick() {
        console.log( 'onSendEmailBtn' )
        console.log( this.model.data.length )
        const emailList = this.model.data.filter( datum => !datum.isSkipping )
        console.log( emailList.length )
        console.log( this.model.data )
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
        Promise.all( [ this.model.CurrentGroups.get(), this.model.DeliveryRoute.get( { query: { label: 'farm' } } ) ] )
        .then( () => {
            this.slurpTemplate( {
                insertion: { el: this.els.daySelect },
                template: this.model.getDayOptions()
            } )

            this.slurpTemplate( {
                insertion: { el: this.els.singleGroupSelect },
                template: this.model.getGroupNameOptions()
            } )

            //this.slurpTemplate( {
              //  insertion: { el: this.els.locationSelect },
                //template: this.model.getLocationOptions()
            //} )
            console.log( this.model.DeliveryRoute.data )
            this.selectedCategory = 'day'
            this.selectedCategoryEl = this.els.daySelect
        } )
        .catch( this.Error )

        return this
    }

}