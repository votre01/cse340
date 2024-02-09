const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    try {
        return await pool.query(
            "SELECT * FROM public.classification ORDER BY classification_name"
        )
    } catch (error) {
        console.error("getclassificationserror")
    }
}

/* ***************************
 *  Get all inventory data
 * ************************** */
async function getInventory() {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory ORDER BY inv_id"
        )
        return data.rows
    } catch (error) {
        console.error("getinventoryerror: " + error)

    }
    
}

/********************************
 * Get all the inventory items and classification_name by classification_id
 ********************************/
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationbyid error: " + error)
    }
}

/* ***************************
 *  Get inventory data by id
 * ************************** */
async function getDetailByInventoryId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getinventorybyiderror: " + error)
    }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Add new inventory
* *************************** */
async function addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
    try {
        const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Add update inventory
* *************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
    try {
        const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* *****************************
*   Add delete inventory item
* *************************** */
async function deleteInventoryItem(inv_id) {
    try {
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
    return data
    } catch (error) {
        new Error("Delete inventory error")
    }
}



module.exports = { getClassifications, getInventoryByClassificationId, getDetailByInventoryId, getInventory, addClassification, addInventory, updateInventory, deleteInventoryItem };