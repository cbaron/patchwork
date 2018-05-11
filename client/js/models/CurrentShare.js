module.exports = { ...require('./__proto__'),

    getSizeOptions() {
        return this.data.produceOptions.filter( option => /size/i.test( option.prompt ) )
    },

    resource: 'currentShare'

}