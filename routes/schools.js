const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// ─────────────────────────────────────────
// GET /schools  — fetch all records
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    console.log('Fetching schools...');
    const result = await pool.query('SELECT * FROM school_reports ORDER BY id ASC');
    res.json(result.rows);          // array directly → frontend setTeamData(data) works
  } catch (error) {
    console.error('GET /schools error =>', error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// PUT /schools/:id  — update a record
// ─────────────────────────────────────────
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
    const result = await pool.query(
      `UPDATE school_reports SET
        district                      = $1,
        block_name                    = $2,
        udise_code                    = $3,
        school_name                   = $4,
        school_category               = $5,
        management_category           = $6,
        centenary_celebration_status  = $7,
        celebration_date              = $8,
        meeting_conducted_status      = $9,
        committee_formed_status       = $10
       WHERE id = $11
       RETURNING *`,
      [
        district,
        block_name,
        udise_code,
        school_name,
        school_category,
        management_category,
        centenary_celebration_status,
        celebration_date || null,     // empty string → null in DB
        meeting_conducted_status,
        committee_formed_status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School not found' });
    }

    console.log(`Updated school id=${id}`);
    res.json(result.rows[0]);         // return updated row
  } catch (error) {
    console.error(`PUT /schools/${id} error =>`, error);
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// DELETE /schools/:id  — delete a record
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM school_reports WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School not found' });
    }

    console.log(`Deleted school id=${id}`);
    res.json({ message: 'Deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    console.error(`DELETE /schools/${id} error =>`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;