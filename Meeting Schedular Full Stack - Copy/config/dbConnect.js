const mongoose = require("mongoose");

const dbConnect = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .catch((err) => console.log(err.message))
    .then(() => console.log("DB Connected..."));
};

dbConnect();
