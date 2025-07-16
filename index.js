const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./payment.db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    address TEXT,
    item TEXT,
    quantity INTEGER,
    price REAL,
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.post('/place-order', (req, res) => {
  const { fullname, address, item, quantity, price, payment } = req.body;
  db.run(
    `INSERT INTO orders (fullname, address, item, quantity, price, payment_method)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [fullname, address, item, quantity, price, payment],
    function(err) {
      if (err) {
        console.log(err);
        return res.send('Order failed!');
      }
      res.send(`<h2>Thank you, ${fullname}! Your order for ${item} has been placed.</h2>`);
    }
  );
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
