const express = require("express");

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");
const { notFound } = require("./utils/errors");
const { createUser, login} = require("./controllers/users");
const auth = require("./middlewares/auth");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(cors());
app.post('/signin', login);
app.post('/signup', createUser);
app.use("/users", auth, usersRouter);
app.use("/items", auth, clothingItemsRouter);

app.use((req, res) => {
  res.status(notFound).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  // console.log(`App listening at port ${PORT}`);
});
