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
          SELECT

          attendance.id,

          attendance.employee_id,

          attendance.employee_name,

          attendance.role,

          attendance.check_in,

          attendance.check_out,

          attendance.work_done,

          employees.email,

          employees.department,

          employees.designation

          FROM attendance

          LEFT JOIN employees

          ON attendance.employee_id =
          employees.id

          ORDER BY attendance.id DESC
          `
        )

      res.status(200).json({

        success: true,

        data:
          result.rows,

      })

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

        employee_id,

        employee_name,

        role,

        full_datetime,

      } = req.body

      if (!employee_name) {

        return res.status(400).json({

          success: false,

          message:
            'Employee name required',

        })
      }

      const result =
        await pool.query(

          `
          INSERT INTO attendance
          (

            employee_id,

            employee_name,

            role,

            check_in

          )

          VALUES ($1, $2, $3, $4)

          RETURNING *
          `,

          [

            employee_id,

            employee_name,

            role,

            full_datetime,

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
/* CHECK OUT */
/* ===================================== */

router.post(

  '/checkout',

  async (req, res) => {

    try {

      const {

        employee_id,

        full_datetime,

      } = req.body

      const result =
        await pool.query(

          `
          UPDATE attendance

          SET

          check_out = $1

          WHERE employee_id = $2

          AND check_out IS NULL

          RETURNING *
          `,

          [

            full_datetime,

            employee_id,

          ]
        )

      res.status(200).json({

        success: true,

        message:
          'Check Out Successful',

        data:
          result.rows[0],

      })

    } catch (error) {

      console.log(
        'CHECK OUT ERROR:',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Check Out Failed',

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