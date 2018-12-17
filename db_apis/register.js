const database = require('../services/database.js');
const oracledb = require('oracledb');
//const bcrypt = require('bcrypt-nodejs');

const baseQuery =
    `select *
 from users`;

//Read E-mail
async function findEmail(context) {
    let query = baseQuery;
    const binds = {};

    binds.USEREMAIL = context.email;

    query += `\nwhere USEREMAIL = :USEREMAIL`;

    const result = await database.Query(query, binds);

    //If the e-mail is already on the DB return true, false otherwise
    if (result.rows.length === 1) {

        return true;
    } else {

        return false;
    }
}

module.exports.findEmail = findEmail;

//Find userid
async function findUserid(context) {
    let query = baseQuery;
    const binds = {};

    binds.USERID = context.userid;

    query += `\nwhere USERID = :USERID`;

    const result = await database.Query(query, binds);

    //If the userid is already on the DB return true, false otherwise
    if (result.rows.length === 1) {

        return true;
    } else {

        return false;
    }
}

module.exports.findUserid = findUserid;