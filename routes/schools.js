const express =
  require('express')

const router =
  express.Router()

const pool =
  require('../db')

/* ===================================== */
/* GET ALL SCHOOL REPORTS */
/* ===================================== */

router.get(

  '/',

  async (req, res) => {

    try {

      console.log(
        'Fetching school reports...'
      )

      const result =
        await pool.query(

          `
          SELECT *

          FROM school_reports

            ORDER BY created_at DESC          `
        )

      console.log(
        'TOTAL RECORDS:',
        result.rows.length
      )

      res.status(200).json({

        success: true,

        data:
          result.rows,

      })

    } catch (error) {

      console.log(
        'FULL DB ERROR =>',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Failed to fetch school reports',

        error:
          error.message,

      })
    }
  }
)

module.exports =
  router