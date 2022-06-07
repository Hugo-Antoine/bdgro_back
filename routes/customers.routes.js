import express from "express";
import connection from "../database.js";

const customers = express.Router();

customers.post("/", (req, res) => {
  const { first_name, last_name, grade } = req.body;
  connection.query(
    `
    INSERT INTO customers (first_name, last_name, grade)
    VALUES ("${first_name}", "${last_name}", "${grade}");
    `,
    (error, rows, fields) => {
      res.send({ id: rows.insertId });
    }
  );
});

customers.get("/", (req, res) => {
  connection.query(
    `
    SELECT * FROM customers
    WHERE shadow_delete = 0;
    `,
    (error, rows, fields) => {
      res.send(rows);
    }
  );
});

customers.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `
    SELECT * FROM customers
    WHERE id = ${id}
    AND shadow_delete = 0;
    `,
    (error, rows, fields) => {
      if (rows.length === 0) {
        res.status(404);
        res.send("No customer at the id provided");
      } else {
        let customer = rows[0];
        connection.query(
          `
          SELECT SUM(price * quantity) AS total_price FROM orders
          INNER JOIN ordercontent ON orders.id = ordercontent.order_id 
          INNER JOIN products ON ordercontent.product_id = products.id
          WHERE customer_id = ${id}
          AND orders.payment_method = "account";
          `,
          (error, rows, fields) => {
            customer.sold = -Math.round(rows[0].total_price * 10) / 10;
            connection.query(
              `
              SELECT SUM(amount) AS total_add FROM transactions
              WHERE customer_id = ${id};
              `,
              (error, rows, fields) => {
                customer.sold += parseFloat(
                  Math.round(rows[0].total_add * 10) / 10
                );
                customer.sold = parseFloat(customer.sold.toFixed(2));
                res.send(customer);
              }
            );
          }
        );
      }
    }
  );
});

customers.put("/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, grade } = req.body;
  connection.query(
    `
    UPDATE customers
    SET first_name = "${first_name}", last_name = "${last_name}", grade = ${grade}
    WHERE id = ${id}
    AND shadow_delete = 0;
    `,
    (error, rows, fields) => {
      if (rows.affectedRows === 0) {
        res.status(404);
        res.send("No customer at the id provided");
      } else {
        res.send(rows[0]);
      }
    }
  );
});

customers.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `
    UPDATE customers
    SET shadow_delete = 1
    WHERE id = ${id}
    AND shadow_delete = 0;
    `,
    (error, rows, fields) => {
      if (rows.affectedRows === 0) {
        res.status(404);
        res.send("No customer at the id provided");
      }
      res.send("Customer deleted");
    }
  );
});

export default customers;
