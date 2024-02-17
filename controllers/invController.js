const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
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

invCont.getScreenName = async function (account) {
    let accData = await accModel.getAccountById(account_id)
    let accName = accData.account_firstname.charAt(0) + accData.account_lastname
    return accName
}

/* ***************************
 *  Build detail by inventory view
 * ************************** */
invCont.buildByInventoryId = async function(req, res, next) {
    const inv_id = req.params.inventoryId
    let nav = await utilities.getNav()
    const data = await invModel.getDetailByInventoryId(inv_id)
    const reviewData = await reviewModel.getReviewsByInventoryId(inv_id)
    const detail = await utilities.buildByInventoryId(data)
    const reviews = await utilities.buildReviewsByInventoryId(reviewData)

    const vehicleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model 
    res.render("./inventory/vehicle", {
        title: vehicleName,
        inv_id,
        nav,
        reviews,
        detail,
    })
}

/* ***************************
 *  Build vehicle manager view
 * ************************** */
invCont.buildInventoryManager = async function(req, res, next) {
    let nav = await utilities.getNav()
    const classificationOptions = await utilities.getClassDropdown()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationOptions,
        errors: null
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
            title: "Inventory Management",
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
        const classificationOptions = await utilities.getClassDropdown() 
        req.flash(
            "notice",
            `You have successfully added the ${inv_year} ${inv_make} ${inv_model}.`
        )
        res.status(201).render("./inventory/management", {
            
            title: "Inventory Management",
            classificationOptions,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function(req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const invData = await invModel.getDetailByInventoryId(inv_id)
    const invItemData = invData[0];
    const classificationOptions = (await utilities.getClassDropdown())
    const invItemName = `${invItemData.inv_make} ${invItemData.inv_model}`
        res.render("./inventory/edit-inventory", {
        title: `Edit ${invItemName}`,
        nav,
        classificationOptions,
        errors: null,
        inv_id: invItemData.inv_id,
        inv_make: invItemData.inv_make,
        inv_model: invItemData.inv_model,
        inv_year: invItemData.inv_year,
        inv_description: invItemData.inv_description,
        inv_image: invItemData.inv_image,
        inv_thumbnail: invItemData.inv_thumbnail,
        inv_price: invItemData.inv_price,
        inv_miles: invItemData.inv_miles,
        inv_color: invItemData.inv_color,
        classification_id: invItemData.classification_id
    })
}

/* ****************************************
*  Process update inventory
* *************************************** */
invCont.updateInventory = async function(req, res) {
    let nav = await utilities.getNav()
    const {inv_id, classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    )

    if (updateResult) {
        const itemName = updateResult.rows[0].inv_make + " " + updateResult.rows[0].inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationOptions = await utilities.getClassDropdown()
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed")
        res.status(501).render("./inventory/edit-inventory", {
            title: `Edit ${itemName}`,
            nav,
            classificationOptions: classificationOptions,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

/* ****************************************
*  Deliver delete inventory view
* *************************************** */
invCont.buildDeleteInventoryItem = async function(req, res, next) {
    const inv_id = parseInt(req.params.inv_id)    
    let nav = await utilities.getNav()
    const invData = await invModel.getDetailByInventoryId(inv_id)
    const invItemData = invData[0];
    const invItemName = `${invItemData.inv_make} ${invItemData.inv_model}`
    res.render("./inventory/delete-confirm", {
        title: `Delete ${invItemName}`,
        nav,
        errors: null,
        inv_id: invItemData.inv_id,
        inv_make: invItemData.inv_make,
        inv_model: invItemData.inv_model,
        inv_price: invItemData.inv_price,
        inv_year: invItemData.inv_year,
    })    
}

/* ****************************************
*  Process delete inventory item
* *************************************** */
invCont.deleteInventoryItem = async function(req, res, next) {
    let nav = await utilities.getNav()
    const inv_id = parseInt(req.body.inv_id)

    const deleteItemResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteItemResult) {
        req.flash("notice", 'Deletion was successful.')
        res.redirect("/inv/")
    } else {
        req.flash("notice", 'Sorry, the deleted failed.')
        res.redirect("/inv/delete/inv_id")  
    }
}

module.exports = invCont