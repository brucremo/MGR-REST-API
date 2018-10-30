const database = require('../services/database.js');
const oracledb = require('oracledb');
const bcrypt = require('bcrypt-nodejs');
 
const baseQuery = 
 `select USERID, USERNAME, USERSUMMARY, USERJOINDATE, USERAVATAR, USERLOCATION, USERAGE, USEREMAIL
 from users`;
//Read
async function find(context) {
  let query = baseQuery;
  const binds = {};
 
  if (context.id) {
    binds.USERID = context.id;
 
    query += `\nwhere USERID = :USERID`;
  }
 
  const result = await database.Query(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;

//Create
const createSql =
 `insert into users (
  USERID,
  USERPASSWORD,
  USERNAME,
  USERSUMMARY,
  USERJOINDATE,
  USERAVATAR,
  USERLOCATION,
  USERAGE,
  USEREMAIL
  ) values (
    :USERID,
    :USERPASSWORD,
    :USERNAME,
    :USERSUMMARY,
    :USERJOINDATE,
    :USERAVATAR,
    :USERLOCATION,
    :USERAGE,
    :USEREMAIL
  ) returning USERID
  into :USERID`;

async function create(usr) {
  const user = Object.assign({}, usr);

  user.USERPASSWORD = bcrypt.hashSync(user.USERPASSWORD + user.USERID);

  console.log(user);

  const result = await database.Query(createSql, user);

  return user;
}

module.exports.create = create;

//Update
const updateSql =
 `update USERS
  set USERNAME = :USERNAME,
  USERAGE = :USERAGE,
  USERSUMMARY = :USERSUMMARY,
  USERJOINDATE = :USERJOINDATE,
  USERAVATAR = :USERAVATAR,
  USERLOCATION = :USERLOCATION
  where USERID = :USERID`;
 
async function update(usr) {
  const user = Object.assign({}, usr);

  const result = await database.Query(updateSql, user);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return user;
  } else {
    return result;
  }
}
 
module.exports.update = update;

//Delete
const deleteSql =
 `begin
 
    delete from users
    where USERID = :USERID;
 
    :rowcount := sql%rowcount;
 
  end;`
 
async function del(id) {
  const binds = {
    USERID: id,
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