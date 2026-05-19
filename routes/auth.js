const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcryptjs')

/* ===================================== */
/* LOGIN */
/* ===================================== */

router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and Password required',
      })
    }

    const result = await pool.query(
      `SELECT * FROM employees WHERE email = $1`,
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Email',
      })
    }

    const employee = result.rows[0]

    /* ================================ */
    /* PASSWORD CHECK — bcrypt          */
    /* ================================ */

    const validPassword = await bcrypt.compare(password, employee.password)  // ✅ FIXED

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Password',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Login Successful',
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    })

  } catch (error) {
    console.log('LOGIN ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Login Failed',
    })
  }
})

/* ===================================== */
/* CHECK IN */
/* ===================================== */

router.post('/attendance/checkin', async (req, res) => {
  try {

    const {
      employee_id,
      employee_name,
      role,
      check_in_date,
      check_in_time,
      full_datetime,
    } = req.body

    if (!employee_id || !check_in_date) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and date required',
      })
    }

    /* ================================ */
    /* PREVENT DUPLICATE CHECK IN       */
    /* ================================ */

    const existing = await pool.query(
      `SELECT * FROM attendance
       WHERE employee_id = $1
         AND check_in_date = $2`,
      [employee_id, check_in_date]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today',
      })
    }

    /* ================================ */
    /* INSERT ATTENDANCE                */
    /* ================================ */

    const result = await pool.query(
      `INSERT INTO attendance
       (employee_id, employee_name, role, check_in_date, check_in_time, check_in_datetime)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [employee_id, employee_name, role, check_in_date, check_in_time, full_datetime]
    )

    res.status(201).json({
      success: true,
      message: 'Check In Successful',
      attendance: result.rows[0],
    })

  } catch (error) {
    console.log('CHECKIN ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Check In Failed',
    })
  }
})

/* ===================================== */
/* CHECK OUT                             */
/* ===================================== */

router.post('/attendance/checkout', async (req, res) => {
  try {

    const {
      employee_id,
      check_out_time,
      check_out_date,
      full_datetime,
    } = req.body

    if (!employee_id || !check_out_date) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID and date required',
      })
    }

    /* ================================ */
    /* CHECK IF CHECKED IN TODAY        */
    /* ================================ */

    const existing = await pool.query(
      `SELECT * FROM attendance
       WHERE employee_id = $1
         AND check_in_date = $2`,
      [employee_id, check_out_date]
    )

    if (existing.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No check in found for today',
      })
    }

    /* ================================ */
    /* UPDATE CHECKOUT TIME             */
    /* ================================ */

    const result = await pool.query(
      `UPDATE attendance
       SET check_out_time = $1,
           check_out_datetime = $2
       WHERE employee_id = $3
         AND check_in_date = $4
       RETURNING *`,
      [check_out_time, full_datetime, employee_id, check_out_date]
    )

    res.status(200).json({
      success: true,
      message: 'Check Out Successful',
      attendance: result.rows[0],
    })

  } catch (error) {
    console.log('CHECKOUT ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Check Out Failed',
    })
  }
})

/* ===================================== */
/* GET ATTENDANCE — employee by date     */
/* ===================================== */

router.get('/attendance/:employee_id', async (req, res) => {
  try {

    const { employee_id } = req.params

    const result = await pool.query(
      `SELECT * FROM attendance
       WHERE employee_id = $1
       ORDER BY check_in_date DESC`,
      [employee_id]
    )

    res.status(200).json({
      success: true,
      attendance: result.rows,
    })

  } catch (error) {
    console.log('GET ATTENDANCE ERROR:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
    })
  }
})

module.exports = router