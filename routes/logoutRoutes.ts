import { NextFunction } from "express";

const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req: any, res: any, next: NextFunction) => {
  if (req.session) {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logout successfully" });
    });
  }
});

module.exports = router;
