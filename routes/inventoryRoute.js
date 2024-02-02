// Needed resources
const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const invController = require("../controllers/invController")
const classValidation = require("../utilities/inventory-validation")

// Route to build inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build vehicle detail by inventory id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

// Route to build vehicle management
router.get("/", utilities.handleErrors(invController.buildVehicleManager)) 

// Route to build new classification
router.get("/newclassification", utilities.handleErrors(invController.buildAddClassification))

// Route to build add inventory
router.get("/addinventory", utilities.handleErrors(invController.buildAddInventory))

// Route to process new classification
router.post("/newclassification",
    classValidation.newClassificationRules(),
    classValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Route to process new inventory
router.post("/addinventory",
    classValidation.newInventoryRules(),
    classValidation.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Route to footer error
router.get("/footer", utilities.handleErrors(invController.buildByInventoryId))

module.exports = router;