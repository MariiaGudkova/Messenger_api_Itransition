const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const { BAD_REQUEST_ERROR_CODE, NOTFOUND_ERROR_CODE, SERVER_ERROR_CODE } = require('../utils/constants');
// const {NODE_ENV, JWT_SECRET} = process.env;

const login = (req, res) => {
  const { name } = req.body;
  User.findOne({ name }).orFail().then((user) => {
    const token = jwt.sign(
      { _id: user._id },
      // NODE_ENV === "production" ? JWT_SECRET : 
      "dev-secret",
      { expiresIn: "24h" }
    );
    res.send({ token });
  })
  .catch((e) => {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST_ERROR_CODE).send({
        message: "Incorrect data was transmitted when creating user"
      });
    } 
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      User.create({ name }).then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          // NODE_ENV === "production" ? JWT_SECRET : 
          "dev-secret",
          { expiresIn: "24h" }
        );
        res.send({ token });
      }).catch((e) => { throw new Error(e) })
    }
    else {
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error occurred on the server" });
    }
  })
}

const getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid user _id passed" });
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOTFOUND_ERROR_CODE)
          .send({ message: "The user by the specified _id was not found" });
      } else {
        return res
          .status(SERVER_ERROR_CODE)
          .send({ message: "An error occurred on the server" });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      return res
          .status(SERVER_ERROR_CODE)
          .send({ message: "An error occurred on the server" });
    });
};

const sendMessage = (req, res) => {
  const { user, name, theme, text, time } = req.body;
  User.findOneAndUpdate({ name }, {$addToSet: {messages: [{ sender: user, theme: theme, text: text, time: time }]}}, { new: true }).orFail().then((recipient) => {
      res.send(recipient) }).catch((e) => {
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      return res
        .status(NOTFOUND_ERROR_CODE)
        .send({ message: "A user with this name was not found" });
  } else {
    return res
    .status(SERVER_ERROR_CODE)
    .send({ message: "An error occurred on the server", e:e });
}
})
}

module.exports = { login, sendMessage, getUserInfo, getUsers };