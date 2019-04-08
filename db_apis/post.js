const database = require('../services/database.js');
const oracledb = require('oracledb');

//Read
async function find(context, query) {
    const result = await database.Query(query, context);

    return result.rows;
}

module.exports.find = find;

//Create
async function create(post) {

    const result = await database.Query(
        `INSERT INTO POST (POST_CONTENT, THREAD_ID, STATUS, CREATED_BY)
        VALUES (:POST_CONTENT, :THREAD_ID, :STATUS, :CREATED_BY)`,
        post);

    return result;
}

module.exports.create = create;

//Update
async function update(rel, query) {

    const result = await database.Query(query, rel);

    if (result.rowsAffected && result.rowsAffected === 1) {
        return rel;
    } else {
        return result;
    }
}

module.exports.update = update;

//Delete
const deleteSql =
    `begin

    delete from POST
    where POST_ID = :POST_ID
    and THREAD_ID = :THREAD_ID;
 
    :rowcount := sql%rowcount;
 
  end;`

async function del(rel) {

    rel.rowcount = {
        dir: oracledb.BIND_OUT,
        type: oracledb.VARCHAR
    }

    const result = await database.Query(deleteSql, rel);

    if (result.outBinds.rowcount == 0) {

        return false;
    } else {

        return true;
    }
}

module.exports.delete = del;


