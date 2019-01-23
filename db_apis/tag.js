const database = require('../services/database.js');
const oracledb = require('oracledb');
const igdb = require('igdb-api-node').default;
const client = igdb('aef56bac5ab539faba6d9f9b9429487b');

async function create(obj) {

    var result;

    try {

        const tagObj = {
            TAGID: obj.TAGID
        }
    
        await database.Query(
        `insert into TAGS (TAGID)
            VALUES (:TAGID)`,
        tagObj);
    } catch (err) {

        result = "Tag already exists";
    }

    try {
        result = await database.Query(
            `insert into GAMETAGS (TAGID, GAMEID, USERID)
                VALUES (:TAGID, :GAMEID, :USERID)`,
                obj);
    } catch (err) {

        result = "Tag already exists for this game";
    }

    return result;
}

module.exports.create = create;

//Read
async function find(context) {

    const query = `select GAMEID
    from GAMETAGS
    where USERID = :USERID 
    and TAGID = :TAGID`;

    var result = await database.Query(query, context);

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
 
    delete from GAMETAGS
    where TAGID = :TAGID;
 
    :rowcount := sql%rowcount;
 
  end;`
 
async function del(tagid) {

  const binds = {
    TAGID: tagid,
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