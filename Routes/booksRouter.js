const express = require("express");
const { auth } = require("../MiddleWare/auth.Middleware");
const { booksModel } = require("../Model/booksModel");
const booksRouter = express.Router();
const dotenv = require("dotenv").config();

// Reading all books
booksRouter.get("/", async (req, res) => {
  const books = await booksModel.find(req.query);
  res.status(200).send({ books });
});

// Reading a book
booksRouter.get("/:id", async (req, res) => {
  const book = await booksModel.findOne({ _id: req.params.id });
  if (book) res.status(200).send({ book });
  else res.status(200).send({ msg: "Book Not Found" });
});

// Adding a book
booksRouter.post("/", auth, async (req, res) => {
  const book = new booksModel({ ...req.body });
  await book.save();
  res.status(201).send({ msg: "BOOK ADDED" });
});

// Editing a book
booksRouter.patch("/:id", auth, async (req, res) => {
  await booksModel.findByIdAndUpdate({ _id: req.params.id }, req.body);
  res.status(204).send({ msg: "Book Edited" });
});

// Deleting a book
booksRouter.delete("/:id", auth, async (req, res) => {
  await booksModel.findByIdAndDelete({ _id: req.params.id });
  res.status(202).send({ msg: "book Deleted" });
});

module.exports = { booksRouter };
