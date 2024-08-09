import { NextFunction } from "express";

exports.requireLogin = (req: any, res: any, next: NextFunction) => {
  if (req.session && req.session.user) {
    return next(); // carry on and perform the next in the request-response cycle
  } else {
    return res.status(401).json({ message: "Please login!" });
  }
};
