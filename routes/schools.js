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
        'Fetching schools...'
      )

      const result =
        await pool.query(

          `
          SELECT *

          FROM school_reports

          ORDER BY id DESC
          `
        )

      console.log(
        'TOTAL SCHOOLS:',
        result.rows.length
      )

      res.status(200).json({

        success: true,

        count:
          result.rows.length,

        data:
          result.rows,

      })

    } catch (error) {

      console.log(
        'FULL DB ERROR =>'
      )

      console.log(error)

      res.status(500).json({

        success: false,

        message:
          'Failed to fetch schools',

        error:
          error.message,

      })
    }
  }
)

/* ===================================== */
/* UPDATE SCHOOL */
/* ===================================== */

router.put(

  '/:id',

  async (req, res) => {

    try {

      const { id } =
        req.params

      const {

        district,

        block_name,

        udise_code,

        school_name,

        school_category,

        management_category,

        centenary_celebration_status,

        celebration_date,

        meeting_conducted_status,

        committee_formed_status,

      } = req.body

      const result =
        await pool.query(

          `
          UPDATE school_reports

          SET

          district = $1,

          block_name = $2,

          udise_code = $3,

          school_name = $4,

          school_category = $5,

          management_category = $6,

          centenary_celebration_status = $7,

          celebration_date = $8,

          meeting_conducted_status = $9,

          committee_formed_status = $10

          WHERE id = $11

          RETURNING *
          `,

          [

            district,

            block_name,

            udise_code,

            school_name,

            school_category,

            management_category,

            centenary_celebration_status,

            celebration_date,

            meeting_conducted_status,

            committee_formed_status,

            id,

          ]
        )

      res.status(200).json({

        success: true,

        message:
          'School Updated Successfully',

        data:
          result.rows[0],

      })

    } catch (error) {

      console.log(
        'UPDATE ERROR =>',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Update Failed',

        error:
          error.message,

      })
    }
  }
)

/* ===================================== */
/* DELETE SCHOOL */
/* ===================================== */

router.delete(

  '/:id',

  async (req, res) => {

    try {

      const { id } =
        req.params

      await pool.query(

        `
        DELETE FROM school_reports

        WHERE id = $1
        `,

        [id]
      )

      res.status(200).json({

        success: true,

        message:
          'School Deleted Successfully',

      })

    } catch (error) {

      console.log(
        'DELETE ERROR =>',
        error
      )

      res.status(500).json({

        success: false,

        message:
          'Delete Failed',

        error:
          error.message,

      })
    }
  }
)

module.exports =
  router