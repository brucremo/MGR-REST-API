const register = require('../db_apis/register.js');

//GET requests
async function getEmail(req, res, next) {
    try {

        const context = {};

        context.email = req.params.email;

        const response = await register.findEmail(context);

        res.status(200).json(response);

    } catch (err) {
        next(err);
    }
}

module.exports.getEmail = getEmail;

async function getUserid(req, res, next) {
    try {

        const context = {};

        context.userid = req.params.userid;

        const response = await register.findUserid(context);

        res.status(200).json(response);

    } catch (err) {
        next(err);
    }
}

module.exports.getUserid = getUserid;