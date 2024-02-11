// Needed resources
const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const invController = require("../controllers/invController")
const classValidation = require("../utilities/inventory-validation")
const validateClassification = require("../utilities/inventory-validation")

// Route to build inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build vehicle detail by inventory id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

// Route to build inventory management
router.get("/",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildInventoryManager)
) 

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

// Route to get data from database with AJAX for inv management
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to edit inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

// Route to handle incoming inventory update requests 
router.post("/update/",
    classValidation.newInventoryRules(),
    classValidation.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to deliver detelete inventory item confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventoryItem))

// Route to handle delete inventory item
router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem))

// Route to footer error
router.get("/footer", utilities.handleErrors(invController.buildByInventoryId))

module.exports = router;