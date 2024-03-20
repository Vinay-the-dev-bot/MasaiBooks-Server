const mongoose = require("mongoose");

const booksSchema = mongoose.Schema(
  {
    title: { type: String, require: true },
    author: { type: String, require: true },
    category: { type: String, require: true },
    price: { type: Number, require: true },
    quantity: { type: Number, require: true },
  },
  { versionKey: false }
);

const booksModel = mongoose.model("books", booksSchema);

module.exports = { booksModel };
// {
//   title: "Masai Way 101",
//   author: "Masai School",
//   category: "Editorial",
//   price: 1000,
//   quantity:100
// }
