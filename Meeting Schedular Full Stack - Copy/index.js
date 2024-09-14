require("dotenv").config();
require("./config/dbConnect");
const express = require("express");
const userRoute = require("./Routes/userRoute");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 3001;
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));
app.use(cors({ origin: "*" }));

// ! porting the routes
// app.use(cors());
app.use(cookieParser());

app.use("/api/users", userRoute);

app.listen(PORT, () => {
  console.log("Server started ....");
});
