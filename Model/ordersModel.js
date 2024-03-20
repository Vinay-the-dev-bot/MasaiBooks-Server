const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema(
  {
    user: { type: String, require: true, ref: "users" },
    books: [{ type: String, require: true, ref: "books" }],
    totalAmount: { type: Number, require: true },
  },

  { versionKey: false }
);

const ordersModel = mongoose.model("orders", ordersSchema);

module.exports = { ordersModel };
// {
// 	 user : "65fa82ddf61650f5fbb4415d"
// 	 books : ["65fa8523a9dbfbb02ca0cce9","65fa8523a9dbfbb02ca0cce9"],
// 	 totalAmount: 150000
// }
