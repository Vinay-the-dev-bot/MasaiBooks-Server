const express = require("express");
const { auth } = require("../MiddleWare/auth.Middleware");
const { booksModel } = require("../Model/booksModel");
const { isAdmin } = require("../MiddleWare/isAdmin.Middleware");
const booksRouter = express.Router();
const dotenv = require("dotenv").config();

// Reading all books
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Fetching  all Books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Data Received
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: Dune
 *                   author:
 *                     type: string
 *                     example: Frank Herbert
 *                   category:
 *                     type: string
 *                     example: Sci-Fi
 *                   quantity:
 *                     type: number
 *                     example: 100
 *                   price:
 *                     type: number
 *                     example: 1000
 *       400:
 *         description: Check request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Please provide correct Id
 */
booksRouter.get("/", async (req, res) => {
  const books = await booksModel.find(req.query);
  res.status(200).send({ books });
});

// Reading a book
/**
 * @swagger
 * /api/books/:id:
 *   get:
 *     summary: Fetching single Book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65fa85958dc69afd77ba878b
 *     responses:
 *       200:
 *         description: Book Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: Dune
 *                 author:
 *                   type: string
 *                   example: Frank Herbert
 *                 category:
 *                   type: string
 *                   example: Sci-Fi
 *                 quantity:
 *                   type: number
 *                   example: 100
 *                 price:
 *                   type: number
 *                   example: 1000
 *       400:
 *         description: Check request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Please provide correct Id
 */

booksRouter.get("/:id", async (req, res) => {
  const book = await booksModel.findOne({ _id: req.params.id });
  if (book) res.status(200).send({ book });
  else res.status(200).send({ msg: "Book Not Found" });
});

// Adding a book
/**
 * @swagger
 * /api/books/:
 *   post:
 *     summary: Adding a Book
 *     tags: [Books]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Dune
 *               author:
 *                 type: string
 *                 example: Frank Herbert
 *               category:
 *                 type: string
 *                 example: Sci-Fi
 *               quantity:
 *                 type: number
 *                 example: 10000
 *               price:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Book Added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Book Added
 *       400:
 *         description: Check request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Please provide correct Id
 */
booksRouter.post("/", auth, isAdmin, async (req, res) => {
  const book = new booksModel({ ...req.body });
  await book.save();
  res.status(201).send({ msg: "BOOK ADDED" });
});

// Editing a book
/**
 * @swagger
 * /api/books/:id:
 *   patch:
 *     summary: Editing a Book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65fa85958dc69afd77ba878b
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Dune 2
 *     responses:
 *       200:
 *         description: Book was Edited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Book Added
 *       400:
 *         description: Check request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Please provide correct Id
 */
booksRouter.patch("/:id", auth, isAdmin, async (req, res) => {
  await booksModel.findByIdAndUpdate({ _id: req.params.id }, req.body);
  res.status(204).send({ msg: "Book Edited" });
});

// Deleting a book
/**
 * @swagger
 * /api/books/:id:
 *   delete:
 *     summary: Deleting a Book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65fa85958dc69afd77ba878b
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 65fa8523a9dbfbb02ca0cce9
 *     responses:
 *       200:
 *         description: Book was Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Book Deleted
 *       400:
 *         description: Check request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Please provide correct Id
 */
booksRouter.delete("/:id", auth, isAdmin, async (req, res) => {
  await booksModel.findByIdAndDelete({ _id: req.params.id });
  res.status(202).send({ msg: "book Deleted" });
});

module.exports = { booksRouter };
