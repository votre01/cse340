const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({min: 2})
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required")
            .custom(async (account_email) => { 
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements"),
    ]
}

/*  **********************************
 *  Registration Data Validation
 * ********************************* */
validate.checkRegData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required"),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements"),
    ]
}

validate.checkLoginData = async (req, res, next) => {
    const {account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
 *  Update Data Validation Rules
 * ********************************* */
validate.accountUpdateRules = () => {

    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({min: 2})
            .withMessage("Please provide a last name."), // on error this message is sent. 
            
        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required")
    ]
}

validate.emailUpdateRules = () => {

    return [// valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required")
    ]
}

validate.changePasswordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements"),
    ]
}


/*  **********************************
 *  Registration Data Validation
 * ********************************* */
validate.checkAccountUpdateData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email, account_id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/edit-account", {
            errors,
            title: `Edit account: ${account_firstname}`,
            nav,            
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
        return
    }
    next()
}

validate.checkExistingEmail = async (req, res, next) => {
    const newEmail = req.body.account_email
    console.log(newEmail)
    if (res.locals.accountData.account_email !== newEmail) {
        
        let errors = []
        const emailExists = await accountModel.checkExistingEmail(newEmail)
        console.log("now here...")
        
        if(emailExists) {
            errors.push("Email exists. Please log in or use different email")
            console.log("we have pushed...")
        }
        if (errors.length > 0) {
            let nav = await utilities.getNav()
            req.flash("notice", "Email exists. Please log in or use different email")
            res.redirect(`/account/edit/${res.locals.accountData.account_id}`)
        }                
    } else {        
        next()    
    }
}

module.exports = validate