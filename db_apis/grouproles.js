const database = require('../services/database.js');
const oracledb = require('oracledb');

//Create
async function create(group, query) {

    const result = await database.Query(query, group);

    return result;
}

module.exports.create = create;

//Delete
const deleteSql =
    `begin

    delete from GROUPADMINS
    where GROUPID = :GROUPID; 

    delete from GROUPMEMBERS
    where GROUPID = :GROUPID; 

    delete from GROUPMODERATORS
    where GROUPID = :GROUPID; 

    delete from GROUPS
    where GROUPID = :GROUPID;
 
    :rowcount := sql%rowcount;
 
  end;`

async function del(rel, query) {

    rel.rowcount = {
        dir: oracledb.BIND_OUT,
        type: oracledb.VARCHAR
    }

    const result = await database.Query(query, rel);

    if (result.outBinds.rowcount == 0) {

        return false;
    } else {

        return true;
    }
}

module.exports.delete = del;


