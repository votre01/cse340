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

// Route to edit user account
router.get("/edit/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildEditAccount)
)

router.post("/update",
    utilities.checkLogin,    
    regValidation.accountUpdateRules(),    
    regValidation.checkAccountUpdateData,
    regValidation.checkExistingEmail,
    utilities.handleErrors(accountController.updateAccount)
)

router.post("/changePassword",
    utilities.checkLogin,
    regValidation.changePasswordRules(),
    utilities.handleErrors(accountController.changePassword)
)

// Login process route
router.post("/login",
    regValidation.loginRules(),
    regValidation.checkLoginData,
    utilities.handleErrors(accountController.accountLogin),
)

// Route to account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

router.get("/logout", utilities.handleErrors(accountController.accountLogout))


module.exports = router