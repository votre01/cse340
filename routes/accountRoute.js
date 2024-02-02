const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidation = require("../utilities/account-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to register account
router.post("/register", 
    regValidation.registrationRules(),
    regValidation.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

router.post("/login",
    regValidation.loginRules(),
    regValidation.checkLoginData,
    utilities.handleErrors(accountController.registerAccount),
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router