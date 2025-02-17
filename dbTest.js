const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to DB:', res.rows[0]);
    pool.end();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
})();

