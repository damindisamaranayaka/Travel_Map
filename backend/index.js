const express= require("express");
const mongoose= require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");

dotenv.config();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'  // Allow requests from your frontend
  }));

mongoose
.connect(process.env.MONGO_URL, {
    useNewUrlParser:true , 
    useUnifiedTopology: true
 })
.then(()=>{
    console.log("MongoDB Connected!");
})
.catch((err) => console.log(err));

app.use("/api/users" , userRoute);
app.use("/api/pins" , pinRoute);

app.listen(8800,()=>{
    console.log("Backend server is running!")
})


