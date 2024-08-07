import { Request, Response, NextFunction } from "express";

const express = require("express");

const app = express();
const PORT = 3000;

// Parse JSON payloads
app.use(express.json());
// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hey").status(200);
});

app.listen(PORT, (error: any) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port" + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
