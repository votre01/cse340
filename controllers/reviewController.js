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

reviewCont.buildEditByReviewId = async function(req, res, next) {
    const review_id = parseInt(req.params.review_id)
    const reviewData = await reviewModel.getByReviewId(review_id)
    const nav = await utilities.getNav()
    res.render("./review/edit-review", {
        title: "Edit review",
        nav,
        errors: null,
        review_id,
        review_text: reviewData[0].review_text,
    })
} 

reviewCont.editReview = async function(req, res, next) {
    const nav = await utilities.getNav()
    const {review_id, review_text, inv_id} = req.body
    const reviewData = await reviewModel.getByReviewId(review_id)
    let editResult

    if (reviewData[0].account_id === res.locals.accountData.account_id) {
        editResult = await reviewModel.editReview(review_id, review_text)
    }
    
    if (editResult) {
        req.flash("notice", "You've succuessfully edited your review")
        res.status(200).redirect("/account")
    } else {
        req.flash("notice", "Review edit failed")
        res.status(500).redirect(`/review/edit/${review_id}`)
    }
}

reviewCont.buildDeleteByReviewId = async function(req, res, next) {
    const review_id = parseInt(req.params.review_id)
    const reviewData = await reviewModel.getByReviewId(review_id)
    const nav = await utilities.getNav()
    res.render("./review/delete-review", {
        title: "Delete review",
        nav,
        errors: null,
        review_id,
        review_text: reviewData[0].review_text,
        review_date: reviewData[0].review_date,
    })
}

reviewCont.deleteReview = async function(req, res, next) {
    const nav = await utilities.getNav()
    const {review_id, review_text, inv_id} = req.body
    const reviewData = await reviewModel.getByReviewId(review_id)
    let deleteResult

    if (reviewData[0].account_id === res.locals.accountData.account_id) {
        deleteResult = await reviewModel.deleteReview(review_id)
    }
    
    if (deleteResult) {
        req.flash("notice", "You've succuessfully deleted your review")
        res.status(200).redirect("/account")
    } else {
        req.flash("notice", "Review delete failed")
        res.status(500).redirect(`/review/delete/${review_id}`)
    }
}

module.exports = reviewCont