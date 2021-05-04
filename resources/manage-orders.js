const Base = require('./__proto__'),
    ManageOrders = function() { return Base.apply( this, arguments ) }

Object.assign(ManageOrders.prototype, Base.prototype, {
  db: {
    GET() {
      let where = '';
      let values = [];
      let direction = 'DESC';

      if (this.query.isUnpaid) {
        return this.Postgres.query(
          `SELECT o.*, p.name
          FROM "storeOrder" o
          JOIN member m ON m.id = o."memberId"
          JOIN person p ON p.id = m.personid
          LEFT JOIN (SELECT "orderId", COALESCE(SUM(amount),0) as sum from "storeTransaction" WHERE action = 'payment' GROUP BY "orderId") paid ON paid."orderId" = o.id 
          WHERE (o.total - COALESCE(paid.sum,0)) > 0
          AND o."isFilled" = false
          AND o."isCancelled" = false
          ORDER BY o.created ${direction}`
        );
      }
      if (this.query.isFilled) where = `WHERE o."isFilled" = true AND o."isCancelled" = false `;
      if (this.query.isFilled === false) where = `WHERE o."isFilled" = false AND o."isCancelled" = false `;
      if (this.query.isCancelled) where = `WHERE o."isCancelled" = true `;
      if (this.query.from) {
        where = `WHERE o.created BETWEEN $1 AND $2 AND o."isCancelled" = false `;
        values = [this.query.from, this.query.to];
        direction = 'ASC';
      };

      return this.Postgres.query(
        `SELECT o.*, p.name
        FROM "storeOrder" o
        JOIN member m ON m.id = o."memberId"
        JOIN person p ON p.id = m.personid
        ${where}
        ORDER BY o.created ${direction}
        LIMIT 300`,
        values
      );
    }
  },

})

module.exports = ManageOrders