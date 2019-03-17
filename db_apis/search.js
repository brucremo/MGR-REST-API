const database = require('../services/database.js');
const oracledb = require('oracledb');
const users = require('../db_apis/users.js');

//Read
async function find(context, query) {
    const result = await database.Query(query, context);

    return result.rows;
}

module.exports.find = find;