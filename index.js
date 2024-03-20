const express = require("express");
const { connection } = require("./db");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { userModel } = require("./Model/userModel");
const { booksRouter } = require("./Routes/booksRouter");
const { apiEndPoints } = require("./Routes/endPoints");
app.use(cors());

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for My Application",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:4500" }, { url: "http://exapm.com" }],
};

const options = {
  swaggerDefinition,
  apis: ["./Routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use("/api/books", booksRouter);
app.use("/api", apiEndPoints);

app.get("/", (req, res) => {
  res.send("HOME");
});

app.listen(process.env.PORT, async () => {
  await connection;
  console.log("Connected to DB");
  console.log(`Listening at ${process.env.PORT}`);
});
