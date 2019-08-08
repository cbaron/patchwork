const Base = require('./__proto__'),
    ManageOrders = function() { return Base.apply( this, arguments ) }

Object.assign(ManageOrders.prototype, Base.prototype, {

  db: {
    GET() {
      let where = '';

      if (this.query.isFilled) where = `WHERE o."isFilled" = true AND o."isCancelled" = false `;
      if (this.query.isFilled === false) where = `WHERE o."isFilled" = false AND o."isCancelled" = false `;
      if (this.query.isCancelled) where = `WHERE o."isCancelled" = true `;

      return this.Postgres.query(
        `SELECT o.*, p.name
        FROM "storeOrder" o
        JOIN member m ON m.id = o."memberId"
        JOIN person p ON p.id = m.personid
        ${where}
        ORDER BY o.created DESC`
      );
    }
  },

})

module.exports = ManageOrders