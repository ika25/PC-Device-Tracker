const express = require("express");
const router = express.Router();
const pcController = require("../controllers/pcController");

router.get("/", pcController.getAllPCs);
router.post("/", pcController.addPC);
router.put("/:id", pcController.updateLocation);
router.delete("/:id", pcController.deletePC);

module.exports = router;