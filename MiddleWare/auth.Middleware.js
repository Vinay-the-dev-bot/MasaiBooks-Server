const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const { userModel } = require("../Model/userModel");
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.loginSecret);
      if (decoded) {
        const user = await userModel.findOne({ _id: decoded.id });
        req.body.userId = decoded.id;
        req.body.isAdmin = user.isAdmin;
        next();
      } else {
        res.send({ msg: "Not Authorized" });
      }
    } catch (error) {
      res.send({ msg: error });
    }
  } else {
    res.send({ msg: "Not Authorized" });
  }
};

module.exports = { auth };
