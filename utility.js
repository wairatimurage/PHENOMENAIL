const User = require("./models/userModel");

class CustomError extends Error {
  // generate customized error messages and codes
  constructor(message, name, ...params) {
    super(...params);
    this.name = name;
    this.message = message;
  }
}

const getUserByEmail = async (email) => {
  // check across the three account collections to find user with given email
  const handleError = (err) => (err ? err : null);
  return await User.findOne({ email })
    .then((user) => {
      if (user && email !== undefined) {
        return user;
      }
    })
    .catch((err) => handleError(err));
};

const getUserByDBId = async (id) => {
  // check across the three account collections to find user with given id
  const handleError = (err) => (err ? err : null);
  return await User.findOne({ id })
    .then((user) => {
      if (user && id !== undefined) {
        return user;
      }
    })
    .catch((err) => handleError(err));
};

const checkAuth = (req, res, next) => {
  return !req.user
    ? res.status(401).json({ errorMessage: "Sorry! User Unauthorized." })
    : next();
};

const handleResponseErrors = (res, _err) => {
  // an error handler for internal server errors and databse errors
  console.log(_err);
  res.status(500).json({ errorMessage: "Sorry! An error occured." });
};

module.exports = {
  handleResponseErrors,
  CustomError,
  getUserByDBId,
  getUserByEmail,
  checkAuth,
};
