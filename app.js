const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

mongoose.connect("mongodb://localhost/e_commerce_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define routes for User Management
app.use("/api", require("./routes/users"));
app.use("/api", require("./routes/carts"));
app.use("/api", require("./routes/products"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
