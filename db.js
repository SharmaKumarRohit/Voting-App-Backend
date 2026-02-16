const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Database connected");
});

db.on("error", (error) => {
  console.log("Mongodb raise error", error);
});

db.on("disconnected", () => {
  console.log("Database disconnected");
});
