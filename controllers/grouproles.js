const grouproles = require('../db_apis/grouproles.js');

//POST requests handling - CREATE
function getRelFromRec(req) {
  const info = {
    GROUPID: req.body.GROUPID,
    USERID: req.body.USERID,
    TYPE: req.body.TYPE
  };
 
  return info;
}

async function post(req, res, next) {
  try {

    let rel = getRelFromRec(req);
    var query = "";

    if(rel.TYPE == "ADMIN"){

        query = `insert into GROUPADMINS (GROUPID, USERID) values (:GROUPID, :USERID)`;
    }else if (rel.TYPE == "MODERATOR"){

        query = `insert into GROUPMODERATORS (GROUPID, USERID) values (:GROUPID, :USERID)`;
    }else{

        query = `insert into GROUPMEMBERS (GROUPID, USERID) values (:GROUPID, :USERID)`;
    }

    delete rel.TYPE;

    rel = await grouproles.create(rel, query);
 
    res.status(201).json();
  } catch (err) {
    if(err.errorNum == 1){

      res.status(501).end("ERROR");
    }else{

      res.status(500).end(err.message);
    }
  }
}
 
module.exports.post = post;

//DELETE requests handling - DELETE
async function del(req, res, next) {
  try {
 
    let rel = {
      GROUPID: req.query.GROUPID,
      USERID: req.query.USERID,
      TYPE: req.query.TYPE
    };
    
    var query = `begin `;

    if(rel.TYPE == "ADMIN"){

        query += 
        ` delete from GROUPADMINS 
        where GROUPID = :GROUPID
        and USERID = :USERID; 
        
        :rowcount := sql%rowcount;
        end;`;
    }else if (rel.TYPE == "MODERATOR"){

        query += 
        ` delete from GROUPMODERATORS 
        where GROUPID = :GROUPID
        and USERID = :USERID; 
        
        :rowcount := sql%rowcount;
        end;`;
    }else{

        query += 
        ` delete from GROUPMEMBERS 
        where GROUPID = :GROUPID
        and USERID = :USERID; 
        
        :rowcount := sql%rowcount;
        end;`;
    }

    delete rel.TYPE;

    const success = await grouproles.del(rel, query);
 
    if (success) {
      res.status(204).end();
    } else {
      res.status(409).end("ERROR");
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.del = del;