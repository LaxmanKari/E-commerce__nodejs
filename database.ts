import mongoose, { set, connect as _connect } from "mongoose";
set("strictQuery", true);

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
    .connect(
        "mongodb+srv://laxmankari21:bnKjtfz7PbnlTfDF@cluster-laxman.fcz1s.mongodb.net/"
      )
      .then(() => {
        console.log("database connection successfull");
      })
      .catch((err) => {
        console.log("database connection error" + err);
      });
  }
}

export default Database;
