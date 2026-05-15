const express = require('express');

require('dotenv').config();

const employeeRoutes =
  require('./routes/employees');

const workRoutes =
  require('./routes/work');

const authRoutes =
  require('./routes/auth');

const app = express();

const cors = require('cors')
app.use(cors())

app.use(express.json());

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

app.listen(process.env.PORT, () => {

  console.log(
    `Server Running On Port ${process.env.PORT}`
  );

});