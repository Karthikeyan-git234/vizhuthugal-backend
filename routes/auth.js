const express = require('express')

const router = express.Router()

const pool = require('../db')

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

      /* ================================ */
      /* INVALID EMAIL */
      /* ================================ */

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
      /* PASSWORD CHECK */
      /* ================================ */

      const validPassword =
        password ===
        employee.password

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