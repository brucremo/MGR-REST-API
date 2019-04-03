const database = require('../services/database.js');
const oracledb = require('oracledb');

//Create
async function create(relationship) {

    const result = await database.Query(
        `INSERT INTO GROUPMEMBERS VALUES
      (:GROUPID, :USERID, :STATUS)`,
        relationship);

    return result;
}

module.exports.create = create;

//Update
const updateSql =
    `update GROUPMEMBERS
  set STATUS = :STATUS
  where USERID = :USERID
  and GROUPID = :GROUPID`;

async function update(rel) {

    const result = await database.Query(updateSql, rel);

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
 
    delete from GROUPMEMBERS
    where USERID = :USERID
    and GROUPID = :GROUPID
    and STATUS = 0;
 
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