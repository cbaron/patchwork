module.exports = Object.assign( {}, require('./__proto__'), {

    Pikaday: require('pikaday'),

    Reports: Object.create( this.Model, { resource: { value: 'report' } } ),

    postRender() {

        this.Reports.get()
        .then( () => this.Reports.data.forEach( report => this.slurpTemplate( { template: `<option value="${report.id}">${report.label}</option>`, insertion: { el: this.els.reportName } } ) ) )
        .catch( this.Error )

        return this
    },
} )
