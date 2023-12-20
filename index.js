const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./connectDB");
const app = express();

const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/authRoutes");
const { errorMiddleware } = require("./middleware/errorHandler");

app.use(express.json());
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));
1;
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Connection to DataBase
connectDB();

// routes
app.use("/auth", errorMiddleware, authRoutes);
