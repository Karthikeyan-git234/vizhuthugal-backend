const express = require('express');

const router = express.Router();

const pool = require('../db');

const bcrypt = require('bcryptjs');


// =====================================
// REGISTER
// =====================================

router.post('/register', async (req, res) => {

  const {
    name,
    email,
    password,
  } = req.body;

  try {

    // Check Existing User

    const userExists =
      await pool.query(

        'SELECT * FROM users WHERE email = $1',

        [email]

      );

    if (
      userExists.rows.length > 0
    ) {

      return res.status(400).json({

        message:
          'User already exists'

      });
    }

    // Hash Password

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // Insert User

    const result =
      await pool.query(

        `INSERT INTO users

        (
          name,
          email,
          password
        )

        VALUES ($1, $2, $3)

        RETURNING id, name, email`,

        [
          name,
          email,
          hashedPassword,
        ]

      );

    res.json({

      message:
        'Registration successful',

      user:
        result.rows[0],

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error: err.message

    });

  }

});


// =====================================
// LOGIN
// =====================================

router.post('/login', async (req, res) => {

  const {
    email,
    password,
  } = req.body;

  try {

    // Find User

    const result =
      await pool.query(

        'SELECT * FROM users WHERE email = $1',

        [email]

      );

    if (
      result.rows.length === 0
    ) {

      return res.status(400).json({

        message:
          'Invalid Email'

      });
    }

    const user =
      result.rows[0];

    // Compare Password

    const validPassword =
      await bcrypt.compare(

        password,

        user.password

      );

    if (!validPassword) {

      return res.status(400).json({

        message:
          'Invalid Password'

      });
    }

    res.json({

      message:
        'Login Successful',

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

      }

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error: err.message

    });

  }

});


module.exports = router;