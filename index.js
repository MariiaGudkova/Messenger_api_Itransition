const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();

const { PORT = 5000, MONGO_URL = "mongodb://mongo:GhoVp1cRV5FNpMt8SPl5@containers-us-west-97.railway.app:7049" } =
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
