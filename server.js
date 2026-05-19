const express = require('express')

const cors = require('cors')

require('dotenv').config()

/* ===================================== */
/* ROUTES IMPORT */
/* ===================================== */

const employeeRoutes =
  require('./routes/employees')

const workRoutes =
  require('./routes/work')

const authRoutes =
  require('./routes/auth')

const schoolRoutes =
  require('./routes/schools')

const attendanceRoutes =
  require('./routes/attendance')

/* ===================================== */
/* APP */
/* ===================================== */

const app = express()

/* ===================================== */
/* MIDDLEWARE */
/* ===================================== */

app.use(cors())

app.use(express.json())

/* ===================================== */
/* API ROUTES */
/* ===================================== */

/* Employees */

app.use(
  '/api/employees',
  employeeRoutes
)

/* Work */

app.use(
  '/api/work',
  workRoutes
)

/* Auth */

app.use(
  '/api/auth',
  authRoutes
)

/* Schools */

app.use(
  '/api/schools',
  schoolRoutes
)

/* Attendance */

app.use(
  '/api/attendance',
  attendanceRoutes
)

/* ===================================== */
/* ROOT ROUTE */
/* ===================================== */

app.get(

  '/',

  (req, res) => {

    res.send(
      'Vizhuthugal Backend Running Successfully 🚀'
    )

  }
)

/* ===================================== */
/* SERVER */
/* ===================================== */

const PORT =
  process.env.PORT || 5000

app.listen(

  PORT,

  () => {

    console.log(
      `✅ Server Running On Port ${PORT}`
    )

  }
)