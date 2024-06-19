const jwt = require("jsonwebtoken");
const Config = require("../config/config");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const User = require("../models/users.model");

const generateAdminAuthToken = async (data) => {
  const { _id, role } = data;
  let token = jwt.sign({ id: _id, role: role }, Config.jwt.secret, {
    expiresIn: "1d",
  });
  return token;
};

const VerifyAuthToken = async (req, res, next) => {
  let token = req.headers.authorization;
  const tokenWithoutBearer = token.split(" ")[1];
  if (!tokenWithoutBearer) {
    return res.send(httpStatus.UNAUTHORIZED, {
      message: "user must be LoggedIn....",
    });
  }
  try {
    let payload = await jwt.verify(tokenWithoutBearer, Config.jwt.secret);
    let finduserById = await User.findById(payload.id);
    if (!finduserById) {
      throw new ApiError(httpStatus.BAD_REQUEST, {
        message: "User Not Available",
      });
    }
    req.userId = finduserById._id;
    req.role = finduserById.role;
    req.refId = finduserById.refId;
    return next();
  } catch (error) {
    return res.send(httpStatus.UNAUTHORIZED, {
      message: "Invalid Access Token",
    });
  }
};

module.exports = {
  generateAdminAuthToken,
  VerifyAuthToken,
};
