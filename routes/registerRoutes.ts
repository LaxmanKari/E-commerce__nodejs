import { NextFunction } from "express";
import { IUser } from "../schemas/UserSchema";

import express from "express";
const app = express();
const router = express.Router();
import bodyParser from "body-parser";
import {User} from "../schemas/UserSchema";
const bcrypt = require("bcrypt");

app.set("view engine", "pug");
app.set("views", "views");

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req: any, res: any, next: NextFunction) => {
  res.status(200).render("register");
});

router.post("/", async (req: any, res: any, next: NextFunction) => {
  var userName = req.body.userName.trim();
  var userEmail = req.body.userEmail.trim();
  var userPasswordHash = req.body.userPassword;
  var payload = req.body;

  if (userName && userEmail && userPasswordHash) {
    var user = await User.findOne({ userEmail: userEmail }).catch((error: any) => {

      payload.errorMessage = "Something went wrong";
      res.status(200).send(payload);
    });

    if (user == null) {
      //No user found
      var data = req.body;

      //hash the password
      data.userPasswordHash = await bcrypt.hash(userPasswordHash, 10); //2^10 times crypt

      User.create(data).then((user: any) => {
        req.session.user = user;
        return res.status(200).json({message: 'User registered successfully'});
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
