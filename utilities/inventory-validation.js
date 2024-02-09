const utilities = require(".")
const { body, validationResult } = require("express-validator")
// const invModel = require("../models/inventory-model")
const validateClassification = {}

/*  **********************************
 *  New Classification Data Validation Rules
 * ********************************* */
validateClassification.newClassificationRules = () => {
    return [
        // classification is required and must be string
        body("classification_name")
            .trim()
            .isLength({min: 2})
            .matches(/^\S*$/, 'g')
            .withMessage("Provide a correct classification name."), // on error this message is sent.
    ]
}

validateClassification.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

validateClassification.newInventoryRules = () => {
    return [
        // classification is required and must be an integer
        body("classification_id")
            .trim()
            .isLength({min: 1})
            .isInt({min: 1})
            .withMessage("Please provide a valid classification option."), // on error this message is sent.

        // make is required and must be string
        body("inv_make")
            .trim()
            .isLength({min: 3})
            .withMessage("Please provide a valid make name."), // on error this message is sent.

        // model is required and must be string
        body("inv_model")
            .trim()
            .isLength({min: 3})
            .withMessage("Please provide a valid model name."), // on error this message is sent.

        // description is required and must be string
        body("inv_description")
            .trim()
            .isLength({min: 3})
            .withMessage("Please provide a valid description."), // on error this message is sent.

        // image path is required and must be string
            body("inv_image")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a valid image path."), // on error this message is sent.

        // thumbanil path is required and must be string
        body("inv_thumbnail")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a valid thumbnail path."), // on error this message is sent.
        
        // price is required and must be decimal or integer
        body("inv_price")
            .trim()
            .isLength({min: 1})
            .isDecimal()
            .withMessage("Please provide a valid price."), // on error this message is sent.

        
        // year is required and must be integer
        body("inv_year")
            .trim()
            .isLength({min: 4})
            .isInt({ min: 1000, max: 2100 })
            .withMessage("Please provide a valid year."), // on error this message is sent.
            
        // miles is required and must be integer
        body("inv_miles")
            .trim()
            .isLength({min: 1})
            .isInt({ min: 0})
            .withMessage("Please provide valid mileage."), // on error this message is sent.
            
        // color is required and must be a string
        body("inv_color")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide valid color."), // on error this message is sent.
    ]
}

// Check inventory data validity and redirect to add-inventory if errors
validateClassification.checkInventoryData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationOptions = await utilities.getClassDropdown()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add inventory",
            nav,
            classificationOptions,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

// Check update data validity and redirect to edit if errors
validateClassification.checkUpdateData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationOptions = await utilities.getClassDropdown()
        res.render("inventory/edit-inventory", {
            errors,
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            classificationOptions,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            inv_id
        })
        return
    }
    next()
}


module.exports = validateClassification