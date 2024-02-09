const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav =async function(req, res, next) {
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


Util.checkAccountType = (req, res, next) => {
    if (res.locals.loggedin) {
        accData = res.cookie("jwt")
        if (accData.account_type === "Admin")  {
            next()
        } else {
            return res.redirect("/login")
        }    
    } else {
        return res.redirect("/account/login")
    }
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 *****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util

