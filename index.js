const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()
const user_schema = require('./user_schema');
const mongoose = require("mongoose");
//setup mongoose connection
const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const crypto = require('crypto');

//Project middleware
app.use(cors());
app.use(express.json());


// Project Routes
app.get('/', (req, res) =>{
    res.send('Hello World')
})

//Save User Route
app.post('/user/add', (req, res) =>{

            let newUser = new user_schema({
                name : req.body.name,
                login : req.body.login,
                passwordHash : crypto.createHash('sha256').update(req.body.password).digest('hex')
            });
            return newUser.save().then( result =>{
                res.status(200).json({
                    code: "API.USER.CREATION.SUCESS",
                    message: "new customer added successfully",
                    success: false,
                    data: result
                })
            }).catch(err => {
                res.status(400).json({
                    code: "API.USER.CREATION.FAIL",
                    message: "adding User failed",
                    success: false,
                    error: err
                })
            })
})

//login User Route
app.post('/user/auth', (req, res) =>{

    try {
        user_schema.find({login: req.body.login}).exec().then(user =>{
        if(user.length < 1)
            return res.status(404).json({
                code: "API.LOGIN.USER.NOTFOUND",
                message: "User account not found",
                success: false,
                error: null
            });
        if(crypto.createHash('sha256').update(req.body.password).digest('hex') == user[0].passwordHash){
            return res.status(200).json({
                code: "API.LOGIN.USER.SUCESS",
                message: "success login",
                success: true,
                result: {
                    currentUser: user[0]
                }
            });
        }else{
            return res.status(401).json({
                code: "API.LOGIN.USER.WRONGPASSWORD",
                message: "invalid User password",
                success: false,
                error: null
            });
        }
        })
    } catch (error) {
        return res.status(400).json({
            code: "API.LOGIN.USER.FAILD",
            message: "login failed",
            success: false,
            error: error
        });
    }
})

const server = app.listen(process.env.PORT, function () {
    console.log("test system backend server is running on port : " + (process.env.PORT ));
});