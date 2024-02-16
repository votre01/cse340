const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '"title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"    
    return list
}

/* ************************
 * Constructs the classification HTML options dropdown
 ************************** */
Util.getClassDropdown =async function(req, res, next) {
        let data = await invModel.getClassifications()
        let dropdown = '<select name="classification_id" id="classificationList">'
        dropdown += '<option value="none" selected disabled hidden>Choose a classification</option>'
        data.rows.forEach((row) => {
            dropdown += `<option value="${row.classification_id}">${row.classification_name}</option>`}
        )
    dropdown += "</select>"   
    return dropdown
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildByInventoryId = async function(data) {
    let detail
    if (data.length > 0) {
        data.forEach(item => {
            detail = '<div id="detail-display">'            
            detail += `<img src="${item.inv_image}" alt="Image of ${item.inv_make}">`
            detail += '<div class="vehicle-details">'            
            detail += `<h2>${item.inv_make} ${item.inv_model} Details</h2>`
            detail += `<p class="bold-text">Price: $` + new Intl.NumberFormat('en-US').format(item.inv_price) + `</p>`  
            detail += `<p><span class="bold-text">Description: </span>${item.inv_description}</p>`  
            detail += `<p><span class="bold-text">Color: </span>${item.inv_color}</p>`  
            detail += `<p><span class="bold-text">Miles: </span>` + new Intl.NumberFormat('en-US').format(item.inv_miles) + `</p>`  
            detail +='</div>'
        })
        detail += '</div>'
    } else {
        detail += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
    }
    return detail
}

Util.buildReviewsByInventoryId = async function(data) {
    let reviewList
    if (data.length > 0) {

        data.forEach(review => {
            const accountData = accModel.getAccountById(review.account_id)
            let screenName = accountData.account_firstname.charAt(0) + accountData.account_lastname
            reviewList = '<div id="review-display">'            
            reviewList += `<p>${screenName} `
            reviewList += new Intl.NumberFormat('en-US').format(review.review_date) + `</p>`  
            reviewList += `<p>${review.review_text}</p>`
            reviewList +='</div>'
       })
    }
}

Util.buildReviewsByAccountId =  function(data) {
    let reviewList
    if (data.length > 0) {
        let invName
        reviewList = '<div id="management-review-display">'
        reviewList += `<ul> `        
        data.forEach(review => {
            
            let invD = invModel.getDetailByInventoryId(review.inv_id)
            invD.then(function(result) {
                invName = result[0].inv_year
                console.log("the new name " + invName)
                console.log(result[0])
                return invName                
            })

            console.log("the later name " + invName)
            reviewList += `<li>Reviewed ${invName} ${review.review_date}<p>${review.review_text}</p></li>`    
       })
       reviewList +='</ul>'
       reviewList +='</div>'
    }
    return reviewList
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
            next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 *  Check account type of logged in user
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
    if (res.locals.accountData.account_type === "Client") {
        req.flash("notice", "Please log in as admin.")
        return res.redirect("/account/login")            
    } else {
        next()        
    }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 *****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util