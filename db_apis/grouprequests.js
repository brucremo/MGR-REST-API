const database = require('../services/database.js');
const oracledb = require('oracledb');
const mailer = require('../services/mailer.js');
const users = require('../db_apis/users.js');

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