const pool = require("../database/")


/* ***************************
 *  Get review data by inventory id
 * ************************** */
const getReviewsByInventoryId = async function(inv_id) {
    try {
        let data = await pool.query(
            "SELECT * FROM public.review WHERE inv_id = $1",
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.log("getreviewsbyinventoryid" + error)
    }
}

/* ***************************
 *  Get user reviews data by account id
 * ************************** */
const getReviewsByAccountId = async function(account_id) {
    try {
        let data = await pool.query(
            "SELECT * FROM public.review WHERE account_id = $1",
            [account_id]
        )
        return data.rows
    } catch (error) {
        console.log("getreviewsbyaccountid" + error)
    }
}

/* ***************************
 *  Get all review data by inventory data
 * ************************** */
const addReview = async function(review_text, inv_id,  account_id) {
    try {
        let data = await pool.query(
            "Insert INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3)",
            [review_text, inv_id, account_id]
        )
        return data.rows
    } catch (error) {
        console.log("getreviewsbyinventoryid" + error)
    }
}



module.exports = { getReviewsByInventoryId, addReview, getReviewsByAccountId }