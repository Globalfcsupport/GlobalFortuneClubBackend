const { Request, Response, NextFunction } = require("express");
const config = require("../config/config");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const apiKeyAuthorization = (req, res, next) => {
  try {
    const api = req.query.apiKey;
    if (!api || api !== config.oxaPay.apiKey) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Inavlid Api Key");
    }

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  apiKeyAuthorization,
};
