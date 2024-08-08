const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const bcrypt = require("bcrypt");

app.set("view engine", "pug");
app.set("views", "views");

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  res.status(200).render("register");
});

router.post("/", async (req, res, next) => {
  var userName = req.body.userName.trim();
  var userEmail = req.body.userEmail.trim();
  var userPasswordHash = req.body.userPassword;
  var payload = req.body;

  if (userName && userEmail && userPasswordHash) {
    var user = await User.findOne({ userEmail: userEmail }).catch((error) => {

      payload.errorMessage = "Something went wrong";
      res.status(200).send(payload);
    });

    if (user == null) {
      //No user found
      var data = req.body;

      //hash the password
      data.userPasswordHash = await bcrypt.hash(userPasswordHash, 10); //2^10 times crypt

      User.create(data).then((user) => {
        req.session.user = user;
        return res.redirect("/");
      });
    } else {
      //user found
      if (userEmail == user.userEmail) {
        payload.errorMessage = "Email already in use.";
      } 

      return res.status(200).send(payload);
    }
  } else {
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).send(payload.errorMessage);
  }
});

module.exports = router;
