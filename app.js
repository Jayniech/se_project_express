const express = require("express");

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");
const { notFound } = require("./utils/errors");
const { createUser, login } = require("./controllers/users");
const { validateUserLogIn, validateUserInfoBody } = require("./middleware/validation")
const auth = require("./middleware/auth");
const { errors } = require('celebrate');
const errorHandler = require('./middleware/error-handler');

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// mongoose.connection.on('connected', () => {
//   console.log('Connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.log('MongoDB connection error:', err);
// });

app.use(express.json());
app.use(cors());
app.post("/signup", validateUserInfoBody, createUser);
app.post("/signin", validateUserLogIn, login);
app.use("/users", auth, usersRouter);
app.use("/items", clothingItemsRouter);

app.use(errors());

app.use((req, res) => {
  res.status(notFound).send({ message: "Requested resource not found" });
});
app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`App listening at port ${PORT}`);
});
