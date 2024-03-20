const express = require("express");
const { auth } = require("../MiddleWare/auth.Middleware");
const { booksModel } = require("../Model/booksModel");
const apiEndPoints = express.Router();
const dotenv = require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../Model/userModel");
const { ordersModel } = require("../Model/ordersModel");

// Registering A User
apiEndPoints.post("/register", (req, res) => {
  try {
    bcrypt.hash(req.body.password, 5, async (err, hash) => {
      if (hash) {
        try {
          const user = new userModel({ ...req.body, password: hash });
          await user.save();
          res.status(201).send({ msg: "USER REGISTERED", USER: user });
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

// // Reading all Orders
// apiEndPoints.get("/orders", async (req, res) => {
//   const books = await booksModel.find(req.query);
//   res.status(200).send({ books });
// });

// // Processing a Order
// apiEndPoints.post("/", async (req, res) => {
//   const order = new ordersModel({ ...req.body });
//   await order.save();
//   res.status(201).send({ msg: "BOOK ADDED" });
// });

// Reading all Orders
apiEndPoints.get("/orders", auth, async (req, res) => {
  const orders = await ordersModel.find().populate("user").populate("books");
  res.status(200).send({ orders });
});

// Processing a Order
apiEndPoints.post("/order", auth, async (req, res) => {
  const book = new ordersModel({ ...req.body });
  await book.save();
  res.status(201).send({ msg: "Order Processed" });
});

module.exports = { apiEndPoints };
