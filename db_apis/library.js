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
    `select *
 from GAMESOWNED`;

var resultQuery;
//Read
async function find(context) {
    let query = baseQuery;
    const binds = {};

    if (context.id) {
        binds.USERID = context.id;

        query += `\nwhere USERID = :USERID`;
    }

    resultQuery = await database.Query(query, binds);

    var idsQuery = "";

    for (var i = 0; i < resultQuery.rows.length; i++) {

        idsQuery += resultQuery.rows[i].GAMEID;

        if (resultQuery.rows[i + 1] != undefined) {

            idsQuery += ",";
        }
    }

    if (idsQuery != "") {

        return client.games({
            ids: [
                idsQuery
            ],
            fields: '*'

        }).then(response => {

            for (var i = 0; i < response.body.length; i++) {

                if (resultQuery.rows[i].FAVOURITE == 1) {

                    response.body[i].favourite = true;
                } else {

                    response.body[i].favourite = false;
                }
            }

            return response.body;
        }).catch(err => {

            return err;
        });
    }

    return [];
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

    if (result.outBinds.rowcount == 0) {

        return false;
    } else {

        return true;
    }
}

module.exports.delete = del;

async function favourite(usr) {

    var result;

    var query = `update GAMESOWNED
    set 
    FAVOURITE = 1
    where
    GAMEID = :GAMEID
    and USERID = :USERID`;

    const ins = {
        GAMEID: usr.GAMEID,
        USERID: usr.USERID
    };

    resultQuery = await database.Query(
        `select * from GAMESOWNED
        where
        GAMEID = :GAMEID
        and USERID = :USERID`,
        ins);

    if(resultQuery.rows[0].FAVOURITE == 1){

        query = `update GAMESOWNED
        set 
        FAVOURITE = 0
        where
        GAMEID = :GAMEID
        and USERID = :USERID`;
    } 

    try {

        result = await database.Query(query, ins);
    } catch (err) {

        result = ins.GAMEID + "ALREADY IN THE DATABASE";
    }

    return result;
}

module.exports.favourite = favourite;