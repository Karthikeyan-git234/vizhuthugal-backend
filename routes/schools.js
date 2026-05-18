const express = require('express');

const router = express.Router();

const pool = require('../db');

router.get(

  '/',

  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
          SELECT *
          FROM school_reports
          `
        );

      res.json(result.rows);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        error: 'Server Error',
      });
    }
  }
);

module.exports = router;