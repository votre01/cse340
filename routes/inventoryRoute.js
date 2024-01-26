// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build vehicle detail by inventory id
router.get("/detail/:inventoryId", invController.buildByInventoryId)

// Route to footer error
router.get("/footer/:inventoryId", invController.buildByInventoryId)

module.exports = router;