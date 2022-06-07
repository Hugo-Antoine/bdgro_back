import express from "express";
import connection from "../database.js";

const transactions = express.Router();

transactions.post("/", (req, res) => {
  const { customer_id, amount } = req.body;
  connection.query(
    `
    INSERT INTO transactions (customer_id, amount, date)
    VALUES (${customer_id}, ${amount}, "2022-06-01 03:09:31");
    `,
    (error, rows, fields) => {
      res.send({ id: rows.insertId });
    }
  );
});

export default transactions;
