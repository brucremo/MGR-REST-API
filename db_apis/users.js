const database = require('../services/database.js');
 
const baseQuery = 
 `select * 
 from users`;
 
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

const createSql =
 `insert into users (
  USERID,
  USERPASSWORD,
  USERNAME,
  USERSUMMARY,
  USERJOINDATE,
  USERAVATAR,
  USERLOCATION
  ) values (
    :USERID,
    :USERPASSWORD,
    :USERNAME,
    :USERSUMMARY,
    :USERJOINDATE,
    :USERAVATAR,
    :USERLOCATION
  ) returning USERID
  into :USERID`;

async function create(usr) {
  const user = Object.assign({}, usr);

  const result = await database.Query(createSql, user);

  user.USERID = result.outBinds.USERID[0];

  return user;
}

module.exports.create = create;