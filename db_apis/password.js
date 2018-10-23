const database = require('../services/database.js');
const bcrypt = require('bcrypt-nodejs');

//Query if User + Password pair is correct
const getPwd =
 `select USERPASSWORD
  from USERS
  where USERID = :USERID`;
 
async function pair(usr, qry) {
  const user = Object.assign({}, qry);

  const result = await database.Query(getPwd, user);

  const res = {
    USERID: user.USERID,
    USERPASSWORD: "true"
  };

  if(result.rows.length == 1){

    if(bcrypt.compareSync (usr.USERID + usr.USERPASSWORD, result.rows[0].USERPASSWORD)){

      return res;
    }else{

      res.USERPASSWORD = "false";

      return res;
    }
  }else{

    res.USERPASSWORD = "false";

    return res;
  }

}
 
module.exports.pair = pair;


