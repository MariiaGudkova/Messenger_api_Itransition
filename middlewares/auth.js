const jwt = require("jsonwebtoken");
// eslint-disable-next-line no-undef
const { NODE_ENV, JWT_SECRET } = process.env;
const { UNAUTHORIZATION_ERROR_CODE } = require("../utils/constants");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw "No authorization header";
    }
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET :
       "dev-secret"
    );
    req.user = payload;
    next();
  } catch (e) {
    return res
      .status(UNAUTHORIZATION_ERROR_CODE)
      .send({ message: "Authorization required", e:e });
  }
};