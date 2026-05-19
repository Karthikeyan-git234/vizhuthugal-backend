const express = require('express')

const router = express.Router()

const pool = require('../db')

const bcrypt = require('bcryptjs')

/* ===================================== */
/* REGISTER */
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

      /* Validation */

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

      /* Check Existing User */

      const userExists =
        await pool.query(

          `
          SELECT *
          FROM users
          WHERE email = $1
          `,

          [email]

        )

      if (
        userExists.rows.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            'User already exists',

        })
      }

      /* Hash Password */

      const hashedPassword =
        await bcrypt.hash(

          password,

          10

        )

      /* Insert User */

      const result =
        await pool.query(

          `
          INSERT INTO users

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
          'Registration Successful',

        user:
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

      /* Validation */

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

      /* Find User */

      const result =
        await pool.query(

          `
          SELECT *
          FROM users
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

      const user =
        result.rows[0]

      /* Compare Password */

      const validPassword =
        await bcrypt.compare(

          password,

          user.password

        )

      if (!validPassword) {

        return res.status(400).json({

          success: false,

          message:
            'Invalid Password',

        })
      }

      /* Login Success */

      res.status(200).json({

        success: true,

        message:
          'Login Successful',

        user: {

          id:
            user.id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

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