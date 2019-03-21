const relationship = require('../db_apis/search.js');

//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
  try {

    var context = {};
    var query = `select`;

    if(req.query.GROUPNAME){

        context.GROUPNAME = req.query.GROUPNAME;
        context.GROUPNAME += '%';
        query += ` GROUPID, GROUPNAME from GROUPS where GROUPNAME like :GROUPNAME`;
    }else{

        if(req.query.USEREMAIL){

            context.USEREMAIL = req.query.USEREMAIL;
            context.USEREMAIL += '%';
            query += ` USERID, USERNAME, USERAVATAR, USERSUMMARY, USERLOCATION
             from USERS where USEREMAIL like :USEREMAIL`;
        }else if (req.query.USERID){

            context.USERID = req.query.USERID;
            context.USERID += '%';
            query += ` USERID, USERNAME, USERAVATAR, USERSUMMARY, USERLOCATION 
            from USERS where USERID like :USERID`;
        }else{

            context.USERNAME = req.query.USERNAME;
            context.USERNAME += '%';
            query += ` USERID, USERNAME, USERAVATAR, USERSUMMARY, USERLOCATION
             from USERS where USERNAME like :USERNAME`;
        }
    }

    const rows = await relationship.find(context, query);
 
    if (rows.length >= 1) {
        res.status(200).json(rows);
    } else {
        res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.get = get;