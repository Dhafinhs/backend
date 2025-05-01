const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Tambahkan middleware keamanan
app.use(helmet()); // ← ini dia!
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes
app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use("/item", require("./src/routes/item.route"));
app.use("/transaction", require("./src/routes/transaction.route"));

app.get("/", (req, res) => {
  res.send("API aktif");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
