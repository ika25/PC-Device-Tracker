const express = require("express");
const router = express.Router();

// Import controller
const pcController = require("../controllers/pcController");

// Get all PCs
router.get("/", pcController.getAllPCs);

// Add new PC
router.post("/", pcController.addPC);

// Update PC location
router.put("/:id/location", pcController.updateLocation);

module.exports = router;