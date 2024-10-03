const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'test',
  password: 'postgres',
  port: 5432,
});

// Route to test database connection
app.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Database connected successfully! Current time: ${result.rows[0].now}`);
  } catch (err) {
    res.status(500).send('Database connection failed: ' + err.message);
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World! This is a Node.js app connected to PostgreSQL.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
