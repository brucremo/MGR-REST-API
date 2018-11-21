const database = require('../services/database.js');
const oracledb = require('oracledb');
const igdb = require('igdb-api-node').default;
const client = igdb('aef56bac5ab539faba6d9f9b9429487b');

const createSql =
 `insert into reviews (
  GAMEID,
  USERID,
  REVIEWSUMMARY,
  REVIEWRATING
  ) values (
    :GAMEID,
    :USERID,
    :REVIEWSUMMARY,
    :REVIEWRATING
  )`;

async function create(review) {

    const result = await database.Query(createSql, review);

    return result;
}

module.exports.create = create;

const baseQuery =
    `select *
 from REVIEWS`;
//Read
async function find(context) {
    let query = baseQuery;
    const binds = {};

    if (context.id) {
        binds.GAMEID = context.id;

        query += `\nwhere GAMEID = :GAMEID`;
    }

    var result = await database.Query(query, binds);

    return result.rows;
}

module.exports.find = find;

//Delete
const deleteSql =
 `begin
 
    delete from REVIEWS
    where USERID = :USERID
    and GAMEID = :GAMEID;
 
    :rowcount := sql%rowcount;
 
  end;`
 
async function del(userid, gameid) {

  const binds = {
    USERID: userid,
    GAMEID: gameid,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.VARCHAR
    }
  }

  const result = await database.Query(deleteSql, binds);

  if(result.outBinds.rowcount == 0){

    return false;
  }else{

    return true;
  }
}
 
module.exports.delete = del;