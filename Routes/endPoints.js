const express = require("express");
const { auth } = require("../MiddleWare/auth.Middleware");
const { booksModel } = require("../Model/booksModel");
const apiEndPoints = express.Router();
const dotenv = require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../Model/userModel");
const { ordersModel } = require("../Model/ordersModel");

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *             required:
 *               - username
 *               - password
 *               - email
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Check request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 */
apiEndPoints.post("/register", (req, res) => {
  try {
    bcrypt.hash(req.body.password, 5, async (err, hash) => {
      if (hash) {
        try {
          const user = new userModel({ ...req.body, password: hash });
          await user.save();
          res.status(201).send({ msg: "USER REGISTERED" });
        } catch (error) {
          res.status(400).send({ msg: `${error}` });
        }
      } else {
        res.status(400).send({ msg: `${err}` });
      }
    });
  } catch (error) {
    res.status(400).send({ msg: `${error}` });
  }
});

// Logging In A User

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Logging In a User
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User successfully Logged In
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZmE4MmRkZjYxNjUwZjVmYmI0NDE1ZCIsImlhdCI6MTcxMDkyMDcxMX0.NoTxGxg2sryJs9Z3mx8ztDLppDAjrh3WR2iH6_lDy3Q
 *       400:
 *         description: Check request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 */
apiEndPoints.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).send({ msg: "User not found" });
    } else {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          jwt.sign({ id: user._id }, process.env.loginSecret, (err, token) => {
            if (err) {
              res.status(500).send({ msg: "JWT Error", error: `${err}` });
            } else {
              res.status(201).send({ msg: "USER LOGGED IN", token });
            }
          });
        } else if (!result) {
          res.status(401).send({ msg: "Wrong Credentials" });
        }
      });
    }
  } catch (error) {
    res.status(500).send({ msg: `${error}` });
  }
});

// Reading all Orders
/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Getting all orders
 *     tags: [Orders]
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
apiEndPoints.get("/orders", auth, async (req, res) => {
  const orders = await ordersModel.find().populate("user").populate("books");
  res.status(200).send({ orders });
});

// Processing a Order
/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Processing a order
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Order was Processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order Processed successfully
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
apiEndPoints.post("/order", auth, async (req, res) => {
  const book = new ordersModel({ ...req.body });
  await book.save();
  res.status(201).send({ msg: "Order Processed" });
});

module.exports = { apiEndPoints };
