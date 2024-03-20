const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema(
  {
    user: { type: ObjectId, require: true, ref: "users" },
    books: [{ type: ObjectId, require: true, ref: "books" }],
    totalAmount: { type: Number, require: true },
  },

  { versionKey: false }
);

const ordersModel = mongoose.model("orders", ordersSchema);

module.exports = { ordersModel };
// {
// 	 user : { type: ObjectId, ref: 'User' },
// 	 books : [{ type: ObjectId, ref: 'Book' }],
// 	 totalAmount: Number
// }
