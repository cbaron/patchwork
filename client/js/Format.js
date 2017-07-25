module.exports = {

    Currency: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    Range( int ) {
        return Array.from( Array( int ).keys() )
    },

    GetSelectOptions( options=[] ) {
        return options.map( option => `<option value="${option.value}">${option.label}</option>` ).join('')
    },

    ImageSrc( name ) { return `https://storage.googleapis.com/double-quill-3243/${name}` }
}
