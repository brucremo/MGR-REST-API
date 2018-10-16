const database = require('../services/database.js');
const oracledb = require('oracledb');
 
const baseQuery = 
 `select * 
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

//Update

2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
const updateSql =
 `update USERS
  set USERPASSWORD = :USERPASSWORD,
  USERNAME = :USERNAME,
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
    return null;
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
      type: oracledb.DB_TYPE_VARCHAR
    }
  }
  const result = await database.Query(deleteSql, binds);
 
  return result.outBinds.rowcount === 1;
}
 
module.exports.delete = del;