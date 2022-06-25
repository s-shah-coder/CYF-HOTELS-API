const express = require("express");
const app = express();
const { Pool } = require("pg");

app.use(express.json());

let port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.get("/customers", (req, res) => {
  pool.query("SElECT * FROM customers", (error, result) => {
    res.json(result.rows);
  });
});

app.get("/hotels", function (req, res) {
  pool
    .query("SELECT * FROM hotels")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.post("/hotels", function (req, res) {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;
  console.log({ newHotelName, newHotelRooms, newHotelPostcode });
  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }
  "SELECT $1, $2, name, dog FROM household WHERE name=$3 LIMIT $4 ORDER BY $5",
    ["color", "address"];
  // data validation done with if statement , meaning if new hotel name exists send error with 400 error , else create hotel.
  pool
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        pool
          .query(
            "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)",
            [newHotelName, newHotelRooms, newHotelPostcode]
          )
          .then(() => res.send("Hotel created!"))
          .catch((error) => {
            console.error(error);
            res.status(500).json(error);
          });
      }
    });
});

app.get("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.hotelId;

  pool
    .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.get("/customers", function (req, res) {
  pool
    .query("SELECT * FROM hotels ORDER BY name")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.get("/customers/:customersId", function (req, res) {
  const customerId = req.params.customersId;
  pool
    .query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.put("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const newEmail = req.body.email;
  const updateCity = req.body.city;
  const updateCountry = req.body.country;

  pool
    .query("UPDATE customers SET email=$1, city=$2 WHERE id=$3", [
      newEmail,
      updateCity,
      customerId,
      updateCountry,
    ])
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.get("/products", (req, res) => {
  const productsId = req.query.name;
  let query =
    "SELECT product_name, unit_price, supplier_name FROM products INNER JOIN product_availability on products.id=product_availability.prod_id INNER JOIN suppliers ON suppliers.id=product_availability.supp_id";
  if (productsId) {
    query = `SELECT product_name, unit_price, supplier_name FROM products INNER JOIN product_availability on products.id=product_availability.prod_id INNER JOIN suppliers ON suppliers.id=product_availability.supp_id WHERE product_name LIKE '%${productsId}%'`;
  }
  pool
    .query(query)
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => console.log(error));
});

app.post("/products", (req, res) => {
  const ProductName = req.body.name;

  const query = "INSERT INTO products (product_name) VALUES ($1)";

  pool
    .query(query, [ProductName])
    .then(() => res.send("New product Added!"))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.post("/availability", (req, res) => {
  const newProductId = req.body.prod_id;
  const newSupplierId = req.body.supp_id;
  const newPrice = req.body.unit_price;

  const query =
    "INSERT INTO product_availability (prod_id, supp_id, unit_price) VALUES ($1, $2, $3)";

  pool
    .query(query, [newProductId, newSupplierId, newPrice])
    .then(() => res.send("New product name Added!"))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.post("/customers/:customerId/orders", (req, res) => {
  const newOrderDate = req.body.order_date;
  const newOrderReference = req.body.order_reference;
  const customerId = req.params.customerId;

  let query =
    "INSERT INTO orders (order_date, order_reference, customer_id) VALUES ($1, $2, $3)";

  pool
    .query(query, [newOrderDate, newOrderReference, customerId])
    .then(() => res.send("New order Added!"))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.delete("/orders/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  console.log(req.params);

  pool
    .query("DELETE FROM orders WHERE id=$1", [orderId])
    .then(() => res.send(`Order ${orderId} deleted`))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.delete("/orders/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  console.log(req.params);

  pool
    .query("DELETE FROM orders WHERE id=$1", [orderId])
    .then(() => res.send(`Order ${orderId} deleted`))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.listen(port, function () {
  console.log("Server is listening on port 9999. Ready to accept requests!");
});
