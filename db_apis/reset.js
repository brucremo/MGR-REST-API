const database = require('../services/database.js');
const bcrypt = require('bcrypt-nodejs');
const mailer = require('../services/mailer.js');

//Send reset email and process RESETCODE
const getEmail =
  `select USERID
  from USERS
  where USEREMAIL = :USEREMAIL`;

async function process(usr, qry) {
  const user = Object.assign({}, qry);

  const result = await database.Query(getEmail, user);

  var appURL = "https://mgr-restapi.herokuapp.com";

  if (result.rows.length == 1) {

    const param = {

        USERID = usr.USERID,
        RESETCODE = bcrypt.hashSync(usr.USERID + qry.USEREMAIL)
    };

    await database.Query("update USERS set RESETCODE = :RESETCODE where USERID = :USERID", param);
    //Create trigger to get the current date

    var mailContent = "Hello " + usr.USERID + 
                    "\n We have received your request to reset your password. \n\n " + 
                    "You may do so by clicking the following link: \n\n" + 
                    appURL + usr.USERID + "/reset/" + param.RESETCODE + 
                    "\n\n Keep in mind that this link is only valid for 24 hours. \n\n" + 
                    "Regards, \n MGR Team";

    await mailer.sendMail(qry.USEREMAIL, mailContent);

  } else {

    var mailContent = "Hello " + usr.USERID + 
                    "\n We have received your request to reset your password. \n\n " + 
                    "Unfortunately the e-mail provided does not match any existing user e-mails on our database.\n\n" + 
                    "Please try another e-mail address at our reset e-mail page: " + appURL + "/reset \n\n" + 
                    "Regards, \n MGR Team";

    await mailer.sendMail(qry.USEREMAIL, mailContent);
  }

  return "EMAIL_SENT";
}

module.exports.process = process;

//UPDATE
const updateSQL =
  `update USERS
set USERPASSWORD = :USERPASSWORD
where USERID = :USERID`;

async function create(usr, qry) {
  const user = Object.assign({}, qry);

  const result = await database.Query(getPwd, user);

  if (result.rows.length == 1) {

    if (bcrypt.compareSync(usr.USERID + usr.USERPASSWORD, result.rows[0].USERPASSWORD)) {

      const newUsr = {

        USERID: usr.USERID,
        USERPASSWORD: bcrypt.hashSync(usr.USERPASSWORD + usr.USERNEWPASSWORD)
      };

      const aw = await database.Query(updateSQL, newUsr);

      newUsr.USERPASSWORD = "true";

      return newUsr;
    }else{

      return "WRONG_CURRENT_PASSWORD";
    }
  }else{

    return "USER_NOT_FOUND";
  }
}

module.exports.create = create;

