const express = require('express');

const cors = require('cors');

require('dotenv').config();

const employeeRoutes =
  require('./routes/employees');

const workRoutes =
  require('./routes/work');

const authRoutes =
  require('./routes/auth');

  const schoolRoutes =
  require('./routes/schools');

const app = express();

app.use(cors());

app.use(express.json());

/* ===================================== */
/* ROUTES */
/* ===================================== */

app.use(
  '/api/employees',
  employeeRoutes
);

app.use(
  '/api/work',
  workRoutes
);

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/schools',
  schoolRoutes
);

/* ===================================== */
/* ROOT ROUTE */
/* ===================================== */

app.get('/', (req, res) => {

  res.send(
    'Vizhuthugal Backend Running Successfully 🚀'
  );

});

/* ===================================== */
/* SERVER */
/* ===================================== */

app.listen(
  process.env.PORT || 5000,
  () => {

    console.log(
      `Server Running On Port ${process.env.PORT}`
    );

  }
);