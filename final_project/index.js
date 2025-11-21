const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


//Checking if the user exists
const userExist = (username) => {
    let equalName = users.filter((user)=>{
        return user.username === username
    });
    if (equalName.length > 0){
        return true;
    } else {
        return false;
    }
}

//Checking if user authenticated
const userAuthenticated = (username,password) => {
    let usersValid = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if (usersValid.length > 0) {
        return true;
    } else {
        return false;
    }
}

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if (req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token,"access",(err,user)=> {
        if(!err){
            req.user = user;
            next();
        } 
        else {
            return res.status(403).json({message : "The user is not authenticated!"})
        }
    })
} else {
    return res.status(403).json({message:"The user is not logged in!"})
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
