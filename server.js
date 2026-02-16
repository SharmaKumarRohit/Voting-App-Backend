const express = require("express");
const app = express();
require("dotenv").config(); // configure env file
require("./db"); // database connection

app.use(express.json()); // It allows express app to understand and use JSON data sent from the client.
const PORT = process.env.PORT; // port number

// import routes
const userRoute = require("./routes/userRoute");
const candidateRoute = require("./routes/candidateRoute");

// use routes
app.use("/user", userRoute);
app.use("/candidate", candidateRoute);

// Server running URL
app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`);
});
