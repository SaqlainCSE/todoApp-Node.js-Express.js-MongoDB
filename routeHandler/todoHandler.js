const express = require('express');
const checkLogin = require('../middleware/checkLogin');
const Todo = require('../models/todoModel');
const User = require('../models/userModel');

const route = express.Router();

//============Custom Instance Method / Static / Query Helpers============//


// GET ACTIVE TODOS...................
route.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
});

// GET ACTIVE TODOS WITH CALLBACK...................
route.get("/active-callback", (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err,data) => {
    res.status(200).json({
      data,
    });
  });
});

//GET JS TODOS..................................
route.get("/js", async (req,res) => {
  const data = await Todo.findByJs();
  res.status(200).json({
    data
  });
});

//GET TODOS BY LANGUAGE.........................
route.get("/language", async(req,res) => {
  const data = await Todo.find().byLanguage('react');
  res.status(200).json({
    data
  });
});

//=========================CRUD START=======================//

//GET ALL TODO..................
route.get("/", checkLogin, (req, res) => {

    Todo.find({ status: "active" })
      .populate("user", "name username -_id")
      .select({
        _id: 0,
        __v: 0,
        date: 0,
      })
      .limit(2)
      .exec((err, data) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error!",
          });
        } else {
          res.status(200).json({
            result: data,
            message: "Success",
          });
        }
      });
  });

// GET A TODO by ID
route.get("/:id", async (req, res) => {
  try {
    const data = await Todo.find({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

//POST TODO.................
route.post("/", checkLogin, async (req,res) => {

    const newTodo = new Todo({
      ...req.body,
      user: req.userId
    });

    try{
      const todo = await newTodo.save();
      await User.updateOne({
        _id: req.userId
      }, {
        $push: {
          todos: todo._id
        }
      });
      res.status(200).json({
        message: "Todo was inserted successfully!!",
    });

    } catch (err){
      console.log(err);
      res.status(500).json({
        Error: "This is server side error!!",
    });
    }
});

//POST MULTIPLE TODOS.............
route.post("/all", (req,res) => {

    Todo.insertMany(req.body, (err) => {
        if(err){
            res.status(500).json({
                error: "This is server side error!!",
            });
        } else {
            res.status(200).json({
                message: "Todos were interted successfully!!",
            });
        }
    });

});

//Update Todo.....................
route.put("/:id", (req, res) => {

    const updateTodo = Todo.findByIdAndUpdate({_id: req.params.id }, { $set: { status: "inactive" } }, { new: true, useFindAndModify: false, }, (err) => {

            if(err){
                res.status(500).json({
                    error: "This is server side error!!",
                });
            } else {
                res.status(200).json({
                    message: "Todos were update successfully!!",
                });
            }
        }
        );
    console.log(updateTodo);
});

//DELETE By ID TODO..................
route.delete("/:id", (req, res) => {

    Todo.deleteOne({ _id: req.params.id }, (err) => {
       if (err) {
           res.status(500).json({
             error: "There was a server side error!",
           });
         } else {
           res.status(200).json({
             message: "Todo Deleted Successfully!!!",
           });
         }
   })
});

//=========================CRUD END========================//


module.exports= route;