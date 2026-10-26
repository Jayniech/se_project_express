const express = require("express");

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");
const NotFoundError = require("./utils/errors/NotFoundError");
const { createUser, login } = require("./controllers/users");
const { validateUserLogIn, validateUserInfoBody } = require("./middleware/validation")
const auth = require("./middleware/auth");
const { errors } = require('celebrate');
const errorHandler = require('./middleware/error-handler');
const { requestLogger, errorLogger } = require('./middleware/logger');

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// mongoose.connection.on('connected', () => {
//   console.log('Connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.log('MongoDB connection error:', err);
// });

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.post("/signup", validateUserInfoBody, createUser);
app.post("/signin", validateUserLogIn, login);
app.use("/users", auth, usersRouter);
app.use("/items", clothingItemsRouter);

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`App listening at port ${PORT}`);
});
