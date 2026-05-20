const express = require('express');

const router = express.Router();

const pool = require('../db');

/* ===================================== */
/* GET ALL SCHOOL REPORTS */
/* ===================================== */

router.get('/', async (req, res) => {

  try {

    const result =
      await pool.query(

        `
        SELECT *

        FROM school_reports

        ORDER BY id DESC
        `
      );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch schools',

      error: error.message,
    });
  }
});

/* ===================================== */
/* UPDATE SCHOOL */
/* ===================================== */

router.put('/:id', async (req, res) => {

  const { id } = req.params;

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

  } = req.body;

  try {

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
      );

    res.json({

      success: true,

      data: result.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      error: error.message,
    });
  }
});

/* ===================================== */
/* DELETE SCHOOL */
/* ===================================== */

router.delete('/:id', async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(

      `
      DELETE FROM school_reports

      WHERE id = $1
      `,

      [id]
    );

    res.json({

      success: true,

      message:
        'School deleted successfully',
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      error: error.message,
    });
  }
});

module.exports = router;