require('dotenv').config();

const { Pool } = require('pg');

console.log(
  'DATABASE_URL =>',
  process.env.DATABASE_URL
);

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => {

    console.log(
      'PostgreSQL Connected ✅'
    );

  })
  .catch((err) => {

    console.log(
      'PostgreSQL Connection Error ❌'
    );

    console.log(err);
  });

module.exports = pool;