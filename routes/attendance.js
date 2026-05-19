const express = require('express')

const router = express.Router()

const pool = require('../db')

/* ===================================== */
/* GET ALL ATTENDANCE */
/* ===================================== */

router.get(

  '/',

  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
          SELECT *
          FROM attendance
          ORDER BY id DESC
          `
        )

      res.status(200).json(
        result.rows
      )

    } catch (error) {

      console.log(
        'GET ATTENDANCE ERROR:',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Failed to fetch attendance',

      })
    }
  }
)

/* ===================================== */
/* CHECK IN */
/* ===================================== */

router.post(

  '/checkin',

  async (req, res) => {

    try {

      const {

        employee_name,

      } = req.body

      const now =
        new Date()

      const result =
        await pool.query(

          `
          INSERT INTO attendance
          (
            employee_name,
            check_in
          )

          VALUES ($1, $2)

          RETURNING *
          `,

          [

            employee_name ||
            'Employee',

            now,

          ]
        )

      res.status(201).json({

        success: true,

        message:
          'Check In Successful',

        data:
          result.rows[0],

      })

    } catch (error) {

      console.log(
        'CHECK IN ERROR:',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Check In Failed',

      })
    }
  }
)

/* ===================================== */
/* UPDATE ATTENDANCE */
/* ===================================== */

router.put(

  '/:id',

  async (req, res) => {

    try {

      const { id } =
        req.params

      const {

        employee_name,

        check_in,

        check_out,

        work_done,

      } = req.body

      const result =
        await pool.query(

          `
          UPDATE attendance

          SET

          employee_name = $1,

          check_in = $2,

          check_out = $3,

          work_done = $4

          WHERE id = $5

          RETURNING *
          `,

          [

            employee_name,

            check_in,

            check_out,

            work_done,

            id,

          ]
        )

      res.status(200).json({

        success: true,

        message:
          'Attendance Updated',

        data:
          result.rows[0],

      })

    } catch (error) {

      console.log(
        'UPDATE ERROR:',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Update Failed',

      })
    }
  }
)

/* ===================================== */
/* DELETE ATTENDANCE */
/* ===================================== */

router.delete(

  '/:id',

  async (req, res) => {

    try {

      const { id } =
        req.params

      await pool.query(

        `
        DELETE FROM attendance
        WHERE id = $1
        `,

        [id]

      )

      res.status(200).json({

        success: true,

        message:
          'Attendance Deleted',

      })

    } catch (error) {

      console.log(
        'DELETE ERROR:',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Delete Failed',

      })
    }
  }
)

module.exports = router