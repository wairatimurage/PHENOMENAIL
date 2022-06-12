const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { getUserByUsername, getUserByDBId } = require("./utility");

const initializePassport = (passport) => {
  const authenticateUser = async (username, password, done) => {
    const user = await getUserByUsername(username);
    if (!user) {
      return done(
        {
          error: {
            code: "auth/InvalidUsername",
            message: "No user with given username exists",
          },
        },
        false
      );
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      }
      return done(
        {
          error: {
            code: "auth/InvalidPassword",
            message: "Password Provided is incorect",
          },
        },
        false,
        {
          error: {
            code: "auth/InvalidPassword",
            message: "Password Provided is incorect",
          },
        }
      );
    } catch (error) {
      return done(error, false, {
        error: {
          code: "auth/generic",
          message: "An Error Occured during authentication please try again",
        },
      });
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );
  // strategy config

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) =>
    done(null, await getUserByDBId(id))
  );
};

module.exports = initializePassport;
