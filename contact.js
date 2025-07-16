const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./contact.db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    email TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.post('/contact', (req, res) => {
  const {fullname, email, address} = req.body;
  db.run(
    `INSERT INTO orders (fullname, email, address)
     VALUES (?, ?, ?)`,
    [fullname, email, address],
    function(err) {
      if (err) {
        console.log(err);
        return res.send('Order failed!');
      }
      res.send(`<h2>Thank you, ${fullname}!</h2>`);
    }
  );
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
