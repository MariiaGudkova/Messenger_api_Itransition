const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();

const { PORT = 5000, MONGO_URL = "mongodb://localhost:27017/messengersbd" } =
  // eslint-disable-next-line no-undef
  process.env;
const app = express();

const { handleCors } = require('./middlewares/handleCors');
const routes = require('./routes/index');

mongoose.connect(MONGO_URL);
app.use(express.json());
app.use(helmet());
app.use(handleCors);
app.use(routes);
app.listen(PORT, function() {
  console.log(`listening ${PORT}`);
})
