const mongoose = require("mongoose");
const config = require("./config");
mongoose.set("strictQuery", false);

// const connectionString = `${process.env.CONNECTION_STRING}`;
// console.log('connectionString', connectionString)
const connectionString = `${config.db.dbUrl()}`;

mongoose
  .connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`### DB Connected to ${connectionString}`);
  })
  .catch((err) => console.log(err));
