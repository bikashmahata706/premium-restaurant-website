// Add this in your server.js (same as contact & payment)

const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Already have:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Reservation DB
const dbRes = new sqlite3.Database('./reservation.db');

dbRes.serialize(() => {
  dbRes.run(`CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    date TEXT,
    time TEXT,
    guests INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.post('/reserve', (req, res) => {
  const { name, date, time, guests } = req.body;

  dbRes.run(
    `INSERT INTO reservations (name, date, time, guests) VALUES (?, ?, ?, ?)`,
    [name, date, time, guests],
    function (err) {
      if (err) {
        console.error(err);
        return res.send('❌ Reservation failed!');
      }
      res.send(`<h2>✅ Thank you ${name}! Your table for ${guests} on ${date} at ${time} is reserved.</h2>`);
    }
  );
});

// Add this if not present
app.listen(3000, () => {
  console.log('💛 Server running: http://localhost:3000');
});
