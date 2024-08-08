import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Database from "./database";
const express = require("express");
const session = require('express-session');

const db = new Database();

const app = express();
const PORT = 3000;

// Parse JSON payloads
app.use(express.json());
// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'chips',
  resave: false,
  saveUninitialized: true,
}))

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Home Page -- Hashers MarketPlace").status(200);
});

// Routes
const loginRoute = require('./routes/loginRoutes'); 
const registerRoute = require('./routes/registerRoutes'); 

app.use("/login", loginRoute); 
app.use("/register", registerRoute); 

app.listen(PORT, (error: any) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port" + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
