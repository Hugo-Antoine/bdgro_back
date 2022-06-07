import express from "express";
import connection from "../database.js";

const orders = express.Router();

orders.post("/", (req, res) => {
  const { customer_id, products_list, payment_method } = req.body;
  connection.query(
    `
    INSERT INTO orders (customer_id, payment_method, date)
    VALUES (${customer_id}, "${payment_method}", "2022-06-01 03:09:31");
    `,
    (error, rows, fields) => {
      const id = rows.insertId;
      const values = products_list
        .map((product) => {
          return `(${id}, ${product.id}, ${product.quantity})`;
        })
        .join(", ");
      connection.query(
        `
        INSERT INTO ordercontent (order_id, product_id, quantity)
        VALUES ${values};
        `,
        (error, rows, fields) => {
          products_list.forEach((product) => {
            connection.query(
              `UPDATE products SET stock_quantity = stock_quantity - ${product.quantity} WHERE id = ${product.id};`,
              (error, rows, fields) => {}
            );
          });
          res.send({ id });
        }
      );
    }
  );
});

export default orders;
