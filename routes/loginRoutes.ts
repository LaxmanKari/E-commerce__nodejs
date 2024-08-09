import { NextFunction } from "express";
import { IUser } from "../schemas/UserSchema";

const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const {User} = require("../schemas/UserSchema");
const bcrypt = require("bcrypt");

declare module 'express-session' {
  interface SessionData {
    user: typeof User
  }
}

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req: any, res: any, next: NextFunction) => {
  var payload = req.body;

  if (req.body?.userEmail && req.body.userPassword) {
    var user = await User.findOne({ userEmail: req.body.userEmail }).catch(
      (error: any) => {
        console.log(error);

        payload.errorMessage = "Something went wrong";
        res.status(200).send(payload);
      }
    );

    if (user != null) {
      var result = await bcrypt.compare(req.body.userPassword, user.userPasswordHash);

      if (result === true) {
        req.session.user = user;
        payload.message = "User Logged In Successfully";
        return res.status(200).send(payload.message);
      }
    }

    payload.errorMessage = "Login Credentials Incorrect.";
    return res.status(400).send(payload.errorMessage);
  }

  payload.errorMessage = "Make sure each field has a valid value";
  res.status(200).send(payload.errorMessage);
});

module.exports = router;
