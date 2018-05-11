var Base = require('./__proto__'),
    Document = function() { return Base.apply( this, arguments ) }

Object.assign( Document.prototype, Base.prototype, {

    PATCH() {
        return this.validate.PATCH.call(this)
        .then( () => this.validateUser() )
        .then( () => this.slurpBody() )
        .then( () => this.Mongo.getDb() )
        .then( db => {
            const documentId = this.Mongo.ObjectId( this.path[1] )
            return db.collection( this.body.from ).findOne( { _id: documentId } )
            .then( document => {
                delete document._id
                return db.collection( this.body.to ).insertOne( document )
                .then( ( { insertedId } ) =>
                    db.collection( this.body.from ).deleteOne( { _id: documentId } )
                    .then( () => Promise.resolve( this.respond( { body: Object.assign( { '_id': insertedId }, document ) } ) ) )
                )
            } )
        } )
    }

} )

module.exports = Document
