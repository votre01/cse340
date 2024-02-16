const utilities = require("../utilities")
const reviewModel = require("../models/review-model")
const reviewCont = {}

reviewCont.addReview = async function(req, res) {
    let nav = await utilities.getNav()
    const {review_text, inv_id,  account_id} = req.body
    const addReviewResult = await reviewModel.addReview(review_text, inv_id, account_id)

    if (addReviewResult) {
        req.flash(
            "notice",
            "Thank you for your review"
        )
        res.status(201).redirect("/account")
    } else {
        req.flash("notice", "Adding review failed")
        res.redirect("/detail/inv_id")
    }
}

module.exports = reviewCont