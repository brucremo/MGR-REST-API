const password = require('../db_apis/password.js');

//POST requests handling - CREATE
function getUserFromRec(req) {
  const user = {
    USERID: req.body.USERID,
    USERPASSWORD: req.body.USERPASSWORD
  };
 
  return user;
}
 
async function post(req, res, next) {
    try {
      
        const context = {};
     
        context.id = req.params.id;
     
        const rows = await password.find(context);
     
        if (req.params.id) {
          if (rows.length === 1) {
            res.status(200).json(rows[0]);
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
 
module.exports.post = post;

//PUT requests handling - UPDATE - OK
async function put(req, res, next) {
  try {
    let user = getUserFromRec(req);
 
    user = await password.update(user);
 
    if (user !== null) {
      res.status(200).json(user);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.put = put;

