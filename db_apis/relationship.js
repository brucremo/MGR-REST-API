const database = require('../services/database.js');
const oracledb = require('oracledb');
const mailer = require('../services/mailer.js');
const users = require('../db_apis/users.js');

const baseQuery =
    `select *
 from relationship
 where (USER_ONE_ID = :USERID
 or USER_TWO_ID = :USERID) 
 and STATUS = :STATUS`;
//Read
async function find(context) {

    const result = await database.Query(baseQuery, context);

    return result.rows;
}

module.exports.find = find;

//Create
async function create(relationship) {

    const result = await database.Query(
        `INSERT INTO relationship
      (USER_ONE_ID, USER_TWO_ID, STATUS, ACTION_USERID)
      SELECT :USER_ONE_ID, :USER_TWO_ID, :STATUS, :ACTION_USERID
      FROM dual
      WHERE NOT EXISTS (SELECT * FROM relationship WHERE USER_TWO_ID = :USER_ONE_ID AND USER_ONE_ID = :USER_TWO_ID)`,
        relationship);

    var mailContent = relationship.ACTION_USERID + " has sent you a friend request." +
    "\n\n To accept or decline please visit your friends page at MGR.\n\n" +
        "Regards, \n MGR Team";

    const usr = {}

    if(relationship.ACTION_USERID == relationship.USER_ONE_ID){

        usr.id = relationship.USER_TWO_ID
    }else{

        usr.id = relationship.USER_ONE_ID
    }

    const rows = await users.find(usr);

    await mailer.sendMail(rows[0].USEREMAIL, mailContent);

    return result;
}

module.exports.create = create;

//Update
const updateSql =
    `update relationship
  set STATUS = :STATUS,
  ACTION_USERID = :ACTION_USERID
  where (USER_ONE_ID = :USER_ONE_ID
  and USER_TWO_ID = :USER_TWO_ID) 
  or
  (USER_TWO_ID = :USER_TWO_ID
  and USER_ONE_ID = :USER_ONE_ID) `;

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
 
    delete from relationship
    where (USER_ONE_ID = :USER_ONE_ID
    and USER_TWO_ID = :USER_TWO_ID)
    or
    (USER_TWO_ID = :USER_TWO_ID
    and USER_ONE_ID = :USER_ONE_ID);
 
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


