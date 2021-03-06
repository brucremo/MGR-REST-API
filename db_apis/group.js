const database = require('../services/database.js');
const oracledb = require('oracledb');

//Read
async function find(context, query) {
    const result = await database.Query(query, context);

    if (result.rows.length != 0) {
        var userArray = await database.Query(`select USERID from GROUPADMINS where GROUPID = :GROUPID`, context);
        result.rows[0].GROUPADMINS = userArray.rows;

        userArray = await database.Query(`select USERID, STATUS from GROUPMEMBERS where GROUPID = :GROUPID`, context);
        result.rows[0].GROUPMEMBERS = userArray.rows;

        userArray = await database.Query(`select USERID from GROUPMODERATORS where GROUPID = :GROUPID`, context);
        result.rows[0].GROUPMODERATORS = userArray.rows;
    }
    return result.rows;
}

module.exports.find = find;

//Read
async function findGroupsUser(context) {
    //const result = await database.Query(query, context);
    const result = {

        USERID: context.USERID
    }

    var userArray = await database.Query(
        `SELECT GROUPID, GROUPNAME
        FROM GROUPS
        WHERE GROUPID IN (SELECT GROUPID 
        FROM GROUPADMINS
        WHERE USERID = :USERID)`,
        context);
    result.GROUPADMINS = userArray.rows;

    userArray = await database.Query(
        `SELECT A.GROUPID, A.USERID, A.STATUS, B.GROUPNAME FROM
        (SELECT * 
        FROM GROUPMEMBERS
        WHERE USERID = :USERID
        AND GROUPID IN (SELECT GROUPID
                FROM GROUPS
                WHERE GROUPID IN (SELECT GROUPID
                FROM GROUPMEMBERS
                WHERE USERID = :USERID))) A
        JOIN (SELECT GROUPID, GROUPNAME
                FROM GROUPS
                WHERE GROUPID IN (SELECT GROUPID 
                FROM GROUPMEMBERS
                WHERE USERID = :USERID)) B
        ON A.GROUPID = B.GROUPID`,
        context);
    result.GROUPMEMBERS = userArray.rows;

    userArray = await database.Query(
        `SELECT GROUPID, GROUPNAME
        FROM GROUPS
        WHERE GROUPID IN (SELECT GROUPID 
        FROM GROUPMODERATORS
        WHERE USERID = :USERID)`,
        context);
    result.GROUPMODERATORS = userArray.rows;

    return result;
}

module.exports.findGroupsUser = findGroupsUser;

//Create
async function create(group) {

    const result = await database.Query(
        `INSERT INTO GROUPS (GROUPNAME, GROUPSUMMARY, GROUPPRIVACY, GROUPOWNER)
        VALUES (:GROUPNAME, :GROUPSUMMARY, :GROUPPRIVACY, :GROUPOWNER)`,
        group);

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


