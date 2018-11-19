const database = require('../services/database.js');
const oracledb = require('oracledb');
const igdb = require('igdb-api-node').default;
const client = igdb('aef56bac5ab539faba6d9f9b9429487b');

async function update(usr) {

    const ins = {
        GAMEID: usr.GAMEID,
    };

    var result;

    try {

        result = await database.Query(
            `insert into GAMES (GAMEID)
        VALUES (:GAMEID)`,
            ins
        );
    } catch (err) {

        result = ins.GAMEID + "ALREADY IN THE DATABASE";
    }

    try {
        result = await database.Query(
            `insert into GAMESOWNED (GAMEID, USERID)
                VALUES (:GAMEID, :USERID)`,
            usr);
    } catch (err) {

        result = ins.GAMEID + " Already in " + usr.USERID + "'s Library";
    }

    return result;
}

module.exports.update = update;

const baseQuery =
    `select GAMEID
 from GAMESOWNED`;
//Read
async function find(context) {
    let query = baseQuery;
    const binds = {};

    if (context.id) {
        binds.USERID = context.id;

        query += `\nwhere USERID = :USERID`;
    }

    var result = await database.Query(query, binds);

    var idsQuery = "";

    for(var i = 0; i < result.rows.length; i++){

        idsQuery += result.rows[i].GAMEID;

        if(result.rows[i+1] != undefined){

            idsQuery += ",";
        }
    }

    return client.games({
        ids: [
            idsQuery
        ],
        fields: '*'

    }).then(response => {

        return response.body;
    }).catch(err => {

        return err;
    });
}

module.exports.find = find;

//Delete
const deleteSql =
 `begin
 
    delete from GAMESOWNED
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