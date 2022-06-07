import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import productsRoute from "./routes/products.routes.js";
import customersRoute from "./routes/customers.routes.js";
import transactionsRoute from "./routes/transactions.routes.js";
import ordersRoute from "./routes/orders.routes.js";

app.use("/products", productsRoute);
app.use("/customers", customersRoute);
app.use("/transactions", transactionsRoute);
app.use("/orders", ordersRoute);

app.listen(9999, () => {
  console.log("listening on 9999");
});
