const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, require: true },
  },
  { versionKey: false }
);

const userModel = mongoose.model("users", userSchema);

module.exports = { userModel };
// {
//   "name": "VINAY",
//   "email": "vinay@gmail.com",
//   "password": "123456",
//   "isAdmin": false
// }
