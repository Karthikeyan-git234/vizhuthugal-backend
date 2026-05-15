const express = require('express');

const router = express.Router();

const pool = require('../db');


// =====================================
// GET ALL EMPLOYEES
// =====================================

router.get('/', async (req, res) => {

  try {

    const result =
      await pool.query(
        'SELECT * FROM employees ORDER BY id DESC'
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
// ADD EMPLOYEE
// =====================================

router.post('/', async (req, res) => {

  const {
    name,
    role,
    phone,
    email,
    department,
    joiningDate,
  } = req.body;

  try {

    const result =
      await pool.query(

        `INSERT INTO employees

        (
          name,
          role,
          phone,
          email,
          department,
          joining_date
        )

        VALUES ($1, $2, $3, $4, $5, $6)

        RETURNING *`,

        [
          name,
          role,
          phone,
          email,
          department,
          joiningDate,
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
// UPDATE EMPLOYEE
// =====================================

router.put('/:id', async (req, res) => {

  const { id } = req.params;

  const {
    name,
    role,
    phone,
    email,
    department,
    joiningDate,
  } = req.body;

  try {

    const result =
      await pool.query(

        `UPDATE employees

        SET

        name = $1,
        role = $2,
        phone = $3,
        email = $4,
        department = $5,
        joining_date = $6

        WHERE id = $7

        RETURNING *`,

        [
          name,
          role,
          phone,
          email,
          department,
          joiningDate,
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
// DELETE EMPLOYEE
// =====================================

router.delete('/:id', async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(

      'DELETE FROM employees WHERE id = $1',

      [id]

    );

    res.json({
      message:
        'Employee deleted successfully'
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


module.exports = router;