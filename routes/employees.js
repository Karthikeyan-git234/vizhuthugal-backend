const express = require('express');
const router = express.Router();
const pool = require('../db');

// =====================================
// VALIDATION HELPER
// =====================================

function validateEmployee(data) {
  const errors = [];
  const { name, role, phone, email, department, joiningDate } = data;

  if (!name?.trim())        errors.push('Name is required');
  if (!department?.trim())  errors.push('Department is required');
  if (!joiningDate)         errors.push('Joining date is required');

  const validRoles = ['Technical', 'Mentoring', 'Community'];
  if (!role) {
    errors.push('Role is required');
  } else if (!validRoles.includes(role)) {
    errors.push(`Role must be one of: ${validRoles.join(', ')}`);
  }

  if (!phone) {
    errors.push('Phone is required');
  } else if (!/^[0-9]{10}$/.test(phone)) {
    errors.push('Phone must be exactly 10 digits');
  }

  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Enter a valid email address');
  }

  return errors;
}

// =====================================
// GET ALL EMPLOYEES
// =====================================

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM employees ORDER BY id DESC'
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (err) {
    console.error('[GET /employees]', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
    });
  }
});

// =====================================
// GET SINGLE EMPLOYEE
// =====================================

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID',
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM employees WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (err) {
    console.error('[GET /employees/:id]', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
    });
  }
});

// =====================================
// ADD EMPLOYEE
// =====================================

router.post('/', async (req, res) => {
  const { name, role, phone, email, department, joiningDate } = req.body;

  const errors = validateEmployee(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  try {
    // Check duplicate email
    const existing = await pool.query(
      'SELECT id FROM employees WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An employee with this email already exists',
      });
    }

    const result = await pool.query(
      `INSERT INTO employees
        (name, role, phone, email, department, joining_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name.trim(),
        role,
        phone.trim(),
        email.toLowerCase().trim(),
        department.trim(),
        joiningDate,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: result.rows[0],
    });

  } catch (err) {
    console.error('[POST /employees]', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add employee',
    });
  }
});

// =====================================
// UPDATE EMPLOYEE
// =====================================

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, phone, email, department, joiningDate } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID',
    });
  }

  const errors = validateEmployee(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  try {
    // Check employee exists
    const exists = await pool.query(
      'SELECT id FROM employees WHERE id = $1',
      [id]
    );

    if (exists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check email conflict with another employee
    const emailConflict = await pool.query(
      'SELECT id FROM employees WHERE email = $1 AND id != $2',
      [email.toLowerCase().trim(), id]
    );

    if (emailConflict.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Another employee with this email already exists',
      });
    }

    const result = await pool.query(
      `UPDATE employees
       SET
         name        = $1,
         role        = $2,
         phone       = $3,
         email       = $4,
         department  = $5,
         joining_date = $6
       WHERE id = $7
       RETURNING *`,
      [
        name.trim(),
        role,
        phone.trim(),
        email.toLowerCase().trim(),
        department.trim(),
        joiningDate,
        id,
      ]
    );

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: result.rows[0],
    });

  } catch (err) {
    console.error('[PUT /employees/:id]', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
    });
  }
});

// =====================================
// DELETE EMPLOYEE
// =====================================

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID',
    });
  }

  try {
    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 RETURNING id, name',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      message: `Employee "${result.rows[0].name}" deleted successfully`,
    });

  } catch (err) {
    console.error('[DELETE /employees/:id]', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
    });
  }
});

module.exports = router;