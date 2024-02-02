const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function(req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build detail by inventory view
 * ************************** */
invCont.buildByInventoryId = async function(req, res, next) {
    const inv_id = req.params.inventoryId
    const data = await invModel.getDetailByInventoryId(inv_id)
    const detail = await utilities.buildByInventoryId(data)
    let nav = await utilities.getNav()
    const vehicleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model 
    res.render("./inventory/vehicle", {
        title: vehicleName,
        nav,
        detail,
    })
}

/* ***************************
 *  Build vehicle manager view
 * ************************** */
invCont.buildVehicleManager = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,

    })
}

/* ***************************
 *  Build add classification view
 * ************************** */

invCont.buildAddClassification = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function(req, res, next) {
    let nav = await utilities.getNav()
    let classificationOptions = await utilities.getClassDropdown()
        res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationOptions,
        errors: null
    })
}

/* ****************************************
*  Process new Classification
* *************************************** */
invCont.addClassification = async function(req, res) {
    let nav = await utilities.getNav()
    const {classification_name} = req.body

    const addClassificationResult = await invModel.addClassification (classification_name)

    if (addClassificationResult) {
        req.flash(
            "notice",
            `You have succefully added ${classification_name} classification.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the new classification was failed")
        res.status(501).render("./inventory/add-classification", {
            title: "Add classification",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
*  Process add inventory
* *************************************** */
invCont.addInventory = async function(req, res) {
    let nav = await utilities.getNav()
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body

    const addInvResult = await invModel.addInventory (
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
    )

    if (addInvResult) {
        req.flash(
            "notice",
            `You have successfully added the ${inv_year} ${inv_make} ${inv_model}.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Adding new inventory failed")
        res.status(501).render("./inventory/add-inventory", {
            title: "Add inventory",
            nav,
            errors: null,
        })
    }
}

module.exports = invCont