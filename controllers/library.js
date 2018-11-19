const library = require("../db_apis/library.js");

//PUT requests handling - UPDATE - OK

async function put(req, res, next) {
    try {
        var object = {
            USERID: req.params.userid,
            GAMEID: req.params.gameid
        };

        object = await library.update(object);

        if (object.rowsAffected !== 0 && object.rowsAffected != undefined) {
            res.status(200).end("SUCCESS");
        } else {
            res.status(500).end(object);
        }
    } catch (err) {

        if(err.message.includes("ORA-00001: unique constraint") !== -1){

            res.status(500).end("ALREADY EXISTS");
        }else{

            res.status(404).end("NOT FOUND");
        }
    }
}

module.exports.put = put;

//GET requests handling - RETRIEVE - OK
async function get(req, res, next) {
    try {
  
      const context = {};
   
      context.id = req.params.userid;
   
      const rows = await library.find(context);
   
      if (req.params.userid) {
        if (rows.length >= 0) {
          res.status(200).json(rows);
        } else {
          res.status(404).end();
        }
      } else {
        res.status(200).json(rows);
      }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.get = get;

  //DELETE requests handling - DELETE
async function del(req, res, next) {
    try {
   
      const success = await library.delete(req.params.userid, req.params.gameid);
   
      if (success) {
        res.status(204).end(req.params.gameid + " Removed From" + req.params.userid + "'s Library");
      } else {
        res.status(409).end("ERROR_PAIR_NONEXISTENT");
      }
    } catch (err) {
      next(err);
    }
  }
   
  module.exports.delete = del;