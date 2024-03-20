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
// 	 "user" : "65faa986b14192eb21b6864e",
// 	 "books" : ["65fa85958dc69afd77ba878b","65fa950e3dfa5a781e2b0a51"],
// 	 "totalAmount": 2000
// }
