const mongoose = require("mongoose");

const mongooseUrl = "mongodb://localhost:27017";

mongoose
  .connect(mongooseUrl)
  .then(() => {
    console.log("connected to the mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

// const student = mongoose.Schema({
//   Name: String,
//   rollnumber: Number,
// });
// const Student = mongoose.model("Student", student);

// const adduser = async () => {
//   const datauser = await Student.find({ Name: { $eq: "aryan" } });
//   console.log(datauser);
// };

// adduser();
