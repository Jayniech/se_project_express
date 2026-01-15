const express = require("express");

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");

const usersRouter = require("./routes/users");

const clothingItemsRouter = require("./routes/clothingItems");

const { notFound } = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "695ac35c8846d3b0865ba276",
  };
  next();
});
app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);

app.use((req, res) => {
  res.status(notFound).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  // console.log(`App listening at port ${PORT}`);
});
