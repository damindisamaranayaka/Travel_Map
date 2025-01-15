const router = require("express").Router();
const User= require("../models/User");
const bcrypt = require('bcrypt');

//register

router.post("/register", async (req,res)=>{
    try{
         //generate new password
         const salt = await bcrypt.genSalt(10);
         //hash password
         const hashedPassword = await bcrypt.hash(req.body.password,salt);

         //create new user
         const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
         });
        
         //save user and send response
         const user = await newUser.save();
         res.status(200).json(user._id);

    }catch(err){
         res.status(500).json(err)
    }
});


//login

router.post("/login", async (req,res) =>{
    try{
      console.log(req.body); // Log the request body to verify the incoming data
      //find user
      const user = await User.findOne({username:req.body.username});
      if (!user) {
        return res.status(400).json("Wrong username or password!"); // Stop further execution
      }

      //validate password
      const validPassword = await bcrypt.compare(
        req.body.password, 
        user.password
    );
    if (!validPassword) {
      return res.status(400).json("Wrong username or password!"); // Stop further execution
    }

      //send response
       res.status(200).json({ _id : user._id, username: user.username});

    }catch(err){
      return res.status(500).json(err);
    }
});

module.exports = router;