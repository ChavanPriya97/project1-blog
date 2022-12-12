const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const app = express();

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect(
    "mongodb+srv://PriyankaChavan:priyanka@cluster0.iocf9uz.mongodb.net/project-blogging",
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongoDB connected successfully"))
  .catch( (error) => console.log(error.message));

app.use("/",route);

app.listen(3000,function(){ 
    console.log("application running on port : " + 3000 );
})