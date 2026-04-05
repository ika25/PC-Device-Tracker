// Import dependencies
const express = require("express");
const cors = require("cors");

// Import routes
const pcRoutes = require("./routes/pcs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/pcs", pcRoutes);

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});