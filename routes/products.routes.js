import express from "express";
import connection from "../database.js";

const products = express.Router();

products.post("/", (req, res) => {
  const { name, price, stock_quantity } = req.body;
  connection.query(
    `
    INSERT INTO products (name, price, stock_quantity) 
    VALUES ("${name}", ${price}, ${stock_quantity});
    `,
    (error, rows, fields) => {
      res.send({ id: rows.insertId });
    }
  );
});

products.get("/", (req, res) => {
  connection.query(
    `
    SELECT * FROM products
    WHERE shadow_delete = 0;
    `,
    (error, rows, fields) => {
      res.send(rows);
    }
  );
});

products.get("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `
    SELECT * FROM products
    WHERE id = ${id}
    AND shadow_delete = 0;
    `,
    (error, rows, fields) => {
      if (rows.affectedRows === 0) {
        res.status(404);
        res.send("No product at the id provided");
      } else {
        res.send(rows[0]);
      }
    }
  );
});

products.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, stock_quantity } = req.body;
  connection.query(
    `
    UPDATE products
    SET name = "${name}", price = ${price}, stock_quantity = ${stock_quantity}
    WHERE id = ${id}
    AND shadow_delete = 0;
    `,
    (error, rows, fields) => {
      if (rows.affectedRows === 0) {
        res.status(404);
        res.send("No product at the id provided");
      } else {
        res.send("Product updated");
      }
    }
  );
});

products.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `
    UPDATE products
    SET shadow_delete = 1
    WHERE id = ${id}
    AND shadow_delete = 0;
    `,
    (error, rows, fields) => {
      if (rows.affectedRows === 0) {
        res.status(404);
        res.send("No product at the id provided");
      } else {
        res.send("Product deleted");
      }
    }
  );
});

export default products;
