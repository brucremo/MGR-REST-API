const database = require('../services/database.js');
const bcrypt = require('bcrypt-nodejs');
 
const baseQuery = 
 `select USERID
 USERPASSWORD 
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

//Update
const updateSql =
 `update USERS
  set USERPASSWORD = :USERPASSWORD
  where USERID = :USERID`;
 
async function update(usr) {
  const user = Object.assign({}, usr);

  user.USERPASSWORD = bcrypt.hashSync(user.USERPASSWORD + user.USERID);

  const result = await database.Query(updateSql, user);
 
  if (result.rowsAffected && result.rowsAffected === 1) {
    return "Password Updated Successfully";
  } else {
    return "Error Updating Password";
  }
}
 
module.exports.update = update;
