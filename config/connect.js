const mongoose = require("mongoose");
const mongoPassword = process.env.MONGO_PASSWORD; //Accuring the password from the env File
const url =
  "mongodb+srv://friday:" +
  mongoPassword +
  "@cluster0.azdxdwv.mongodb.net/user-details";

mongoose.connect(url).then(() => console.log("Connected!"));

const db = mongoose.connection;
