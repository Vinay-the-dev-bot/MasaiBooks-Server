const express = require("express");
const { connection } = require("./db");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { userModel } = require("./Model/userModel");
const { booksRouter } = require("./Routes/booksRouter");
app.use(cors());

app.use(express.json());
app.use("/api/books", booksRouter);

app.post("/api/register", (req, res) => {
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

app.post("/api/login", async (req, res) => {
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

app.get("/", (req, res) => {
  res.send("HOME");
});

app.listen(process.env.PORT, async () => {
  await connection;
  console.log("Connected to DB");
  console.log(`Listening at ${process.env.PORT}`);
});
