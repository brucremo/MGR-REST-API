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