const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const checkLogin = require('../middleware/checkLogin');

const route = express.Router();

//Signup...............
route.post("/signup", async(req, res) => {

    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword
    });

    await newUser.save();
    res.status(200).json({
        message: "Successfully Signup!!",
        newUser
    });
    }catch{
        res.status(500).json({
            message: "Signup failed!!!",
        });
    }

});

//Login................
route.post("/login", async(req, res) => {

    try{
        const user = await User.find({username:req.body.username});

        if(user && user.length > 0){
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);

            if(isValidPassword){
                const token = jwt.sign({username: user[0].username, userId: user[0]._id},process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                res.status(200).json({
                    'access_token': token,
                    'message': 'Login Successful!!'
                });
            }else{
                res.status(401).json({
                    'Error': 'Authentication failed!!!'
                });
            }
        }else {
            res.status(401).json({
                'Error': 'Authentication failed!!!'
            });
        }
    }catch{
        res.status(401).json({
            'Error': 'Authentication failed!!!'
        });
    }
});

//GET ALL USERS.................
route.get("/all", async (req,res) => {
    try{
      const users = await User.find().populate("todos",);

      res.status(200).json({
        message: 'All Users',
        data: users
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "There was a server side error!",
      });
    }
  });

module.exports = route;
