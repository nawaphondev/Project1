require("dotenv").config();
const express = require("express");
const cors = require("cors");

const errorHandler = require("./middlewares/error");
const notFoundHandler = require("./middlewares/notFound");
const createError = require("./utils/createError");

const authRoute = require("./routes/auth-route");
const authenticate = require("./middlewares/authenticate");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/auth", authenticate);

app.use(errorHandler);
app.use("*", notFoundHandler);

const port = process.env.PORT;
if (!port) {
  console.error("Port is not set in the environment variables.");
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
