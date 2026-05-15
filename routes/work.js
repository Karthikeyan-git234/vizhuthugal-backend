const express = require('express');

const router = express.Router();

const pool = require('../db');


// =====================================
// GET ALL WORK REPORTS
// =====================================

router.get('/', async (req, res) => {

  try {

    const result =
      await pool.query(

        `SELECT * FROM work_reports
         ORDER BY id DESC`

      );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================================
// ADD WORK REPORT
// =====================================

router.post('/', async (req, res) => {

  const {
    employeeName,
    checkIn,
    checkOut,
    workDone,
  } = req.body;

  try {

    const result =
      await pool.query(

        `INSERT INTO work_reports

        (
          employee_name,
          check_in,
          check_out,
          work_done
        )

        VALUES ($1, $2, $3, $4)

        RETURNING *`,

        [
          employeeName,
          checkIn,
          checkOut,
          workDone,
        ]

      );

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================================
// UPDATE WORK REPORT
// =====================================

router.put('/:id', async (req, res) => {

  const { id } = req.params;

  const {
    employeeName,
    checkIn,
    checkOut,
    workDone,
  } = req.body;

  try {

    const result =
      await pool.query(

        `UPDATE work_reports

        SET

        employee_name = $1,
        check_in = $2,
        check_out = $3,
        work_done = $4

        WHERE id = $5

        RETURNING *`,

        [
          employeeName,
          checkIn,
          checkOut,
          workDone,
          id,
        ]

      );

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


// =====================================
// DELETE WORK REPORT
// =====================================

router.delete('/:id', async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(

      'DELETE FROM work_reports WHERE id = $1',

      [id]

    );

    res.json({
      message:
        'Attendance deleted successfully'
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


module.exports = router;