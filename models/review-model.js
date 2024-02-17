const pool = require("../database/")

/* ***************************
 *  Get review data by review id
 * ************************** */
const getByReviewId = async function(review_id) {
    try {
        let data = await pool.query(
            "SELECT * FROM public.review WHERE review_id = $1",
            [review_id]
        )
        return data.rows
    } catch (error) {
        console.log("getreviewsbyinventoryid" + error)
    }
}


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
 * Model to add new review 
 * ************************** */
const addReview = async function(review_text, inv_id,  account_id) {
    try {
        let data = await pool.query(
            "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3)",
            [review_text, inv_id, account_id]
        )
        return data.rows
    } catch (error) {
        console.log("getreviewsbyinventoryid" + error)
    }
}

/* ***************************
 *  Model to edit existing review
 * ************************** */
const editReview = async function(review_id, review_text) {
    try {
        let data = await pool.query(
            "UPDATE public.review SET review_text = $1 WHERE review_id = $2",
            [review_text, review_id]
        )
        return data.rows
    } catch (error) {
        console.log("editreviewserror" + error)
    }
}

const deleteReview = async function(review_id, review_text) {
    try {
        let data = await pool.query(
            "DELETE FROM public.review WHERE review_id = $1",
            [review_id]
        )
        return data.rows
    } catch (error) {
        console.log("deletereviewerror" + error)
    }
}

module.exports = { getReviewsByInventoryId, addReview, getReviewsByAccountId, editReview, getByReviewId, deleteReview }