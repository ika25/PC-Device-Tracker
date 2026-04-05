const express = require("express");
const router = express.Router();

// Import controller
const pcController = require("../controllers/pcController");

// ===============================
// ROUTES
// ===============================

// GET all PCs
router.get("/", pcController.getAllPCs);

// ADD new PC
router.post("/", pcController.addPC);

// UPDATE PC location
router.put("/:id", pcController.updateLocation);

module.exports = router;