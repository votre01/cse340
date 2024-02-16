const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const validateReview = require("../utilities/review-validation")
const reviewCont = require("../controllers/reviewController")



// Route to process new classification
router.post("/",
    validateReview.newReviewRules(),
    validateReview.checkReviewData,
    utilities.handleErrors(reviewCont.addReview)
)

module.exports = router