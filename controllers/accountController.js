const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_password} = req.body

    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        })
    }

    const regResult = await accountModel.registerAccount (
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check you credentials and try again")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

async function buildAccountManagement(req, res)  {
    let nav = await utilities.getNav()
    const {account_id} = 12
    console.log("account id " + account_id)
    const reviewData = await reviewModel.getReviewsByAccountId(12)
    console.log(reviewData[0])
    const reviews = await utilities.buildReviewsByAccountId(reviewData)
    console.log(reviews)
    req.flash("Login success")
    res.render("account/account-management", {
        title: "Account",
        nav,
        reviews,            
        errors: null,
        accountLogin: "You're logged in",
    })
}

// Process logout account
async function accountLogout(req, res) {
    res.clearCookie("jwt"); // Clear the 'jwt' cookie
    res.redirect("/"); // Redirect to the login page
};

/* ***************************
 *  Build edit account view
 * ************************** */
async function buildEditAccount (req, res, next) {
    const account_id = parseInt(req.params.account_id)
    let nav = await utilities.getNav()
    const accData = await accountModel.getAccountById(account_id)
    const accUserName = `${accData.account_firstname}`
        res.render("./account/edit-account", {
        title: `Edit Account: ${accUserName}`,
        nav,
        errors: null,
        account_firstname: accData.account_firstname,
        account_lastname: accData.account_lastname,
        account_email: accData.account_email,
        account_id: accData.account_id,
    })
}

/* ****************************************
*  Process update account
* *************************************** */
async function updateAccount (req, res) {
    let nav = await utilities.getNav()
    const {account_firstname, account_lastname, account_email, account_id} = req.body

    const updateResult = await accountModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email
    )

    if (updateResult) {
        const accName = updateResult.account_firstname
        req.flash("notice", `You have successfully updated your account ${accName}.\n
            Email: ${updateResult.account_email}\n
            Lastname: ${updateResult.account_lastname}`)
        res.redirect("/account")
    } else {
        const accName = account_firstname
        req.flash("notice", "Sorry, information update failed")
        res.redirect("/account")
    }
}


/* ****************************************
*  Process change password
* *************************************** */
async function changePassword (req, res) {
    let nav = await utilities.getNav()
    const {account_id, account_password} = req.body

    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch {
        req.flash("notice", 'Sorry, there was an error changing password.')
        res.redirect("/account")
    }

    const updateResult = await accountModel.changePassword(
        account_id,
        hashedPassword
    )

    if (updateResult) {
        req.flash("notice", `You have successfully changed your password.`)
        res.redirect("/account")
    } else {
        req.flash("notice", "Sorry, there was an error changing password.")
        res.redirect("/account")
    }
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, accountLogout, buildEditAccount, updateAccount, changePassword }