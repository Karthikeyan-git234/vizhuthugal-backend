const express = require('express');

const router = express.Router();

const pool = require('../db');

router.get('/', async (req, res) => {

  try {

    console.log('Fetching schools...');

    const result = await pool.query(
      'SELECT * FROM school_reports'
    );

    console.log(result.rows);

    res.json(result.rows);

  } catch (error) {

    console.log('FULL DB ERROR =>');

    console.log(error);

    res.status(500).json({

      error: error.message,

      full: error,
    });
  }
});

module.exports = router;