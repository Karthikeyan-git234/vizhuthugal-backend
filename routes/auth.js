const express = require('express')

const router = express.Router()

const pool = require('../db')

const bcrypt = require('bcryptjs')

/* ===================================== */
/* REGISTER EMPLOYEE */
/* ===================================== */

router.post(

  '/register',

  async (req, res) => {

    try {

      const {

        name,

        email,

        password,

        role,

      } = req.body

      /* ================================ */
      /* VALIDATION */
      /* ================================ */

      if (
        !name ||
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            'All fields are required',

        })
      }

      /* ================================ */
      /* CHECK EXISTING EMPLOYEE */
      /* ================================ */

      const employeeExists =
        await pool.query(

          `
          SELECT *
          FROM employees

          WHERE email = $1
          `,

          [email]

        )

      if (
        employeeExists.rows.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Employee already exists',

        })
      }

      /* ================================ */
      /* HASH PASSWORD */
      /* ================================ */

      const hashedPassword =
        await bcrypt.hash(

          password,

          10

        )

      /* ================================ */
      /* INSERT EMPLOYEE */
      /* ================================ */

      const result =
        await pool.query(

          `
          INSERT INTO employees

          (
            name,
            email,
            password,
            role
          )

          VALUES ($1, $2, $3, $4)

          RETURNING
          id,
          name,
          email,
          role
          `,

          [

            name,

            email,

            hashedPassword,

            role || 'employee',

          ]

        )

      res.status(201).json({

        success: true,

        message:
          'Employee Registered Successfully',

        employee:
          result.rows[0],

      })

    } catch (error) {

      console.log(
        'REGISTER ERROR:',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Registration Failed',

      })
    }
  }
)

/* ===================================== */
/* LOGIN */
/* ===================================== */

router.post(

  '/login',

  async (req, res) => {

    try {

      const {

        email,

        password,

      } = req.body

      /* ================================ */
      /* VALIDATION */
      /* ================================ */

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Email and Password required',

        })
      }

      /* ================================ */
      /* FIND EMPLOYEE */
      /* ================================ */

      const result =
        await pool.query(

          `
          SELECT *
          FROM employees

          WHERE email = $1
          `,

          [email]

        )

      if (
        result.rows.length === 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Invalid Email',

        })
      }

      const employee =
        result.rows[0]

      /* ================================ */
      /* COMPARE PASSWORD */
      /* ================================ */

      const validPassword =
        await bcrypt.compare(

          password,

          employee.password

        )

      if (!validPassword) {

        return res.status(400).json({

          success: false,

          message:
            'Invalid Password',

        })
      }

      /* ================================ */
      /* LOGIN SUCCESS */
      /* ================================ */

      res.status(200).json({

        success: true,

        message:
          'Login Successful',

        user: {

          id:
            employee.id,

          name:
            employee.name,

          email:
            employee.email,

          role:
            employee.role,

        }

      })

    } catch (error) {

      console.log(
        'LOGIN ERROR:',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Login Failed',

      })
    }
  }
)

module.exports = router