const express = require('express');
const { Client } = require('pg');

const app = express();
const port = 3000;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error('DB connection error:', err));

app.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT NOW()');
    res.send(`Hello from Node.js! DB Time: ${result.rows[0].now}`);
  } catch (err) {
    res.status(500).send('Database error');
  }
});
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});