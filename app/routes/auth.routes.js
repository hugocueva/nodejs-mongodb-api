const {verifySignup} = require("../middlewares"); 
const controller = require('../controllers/auth.controller'); 
const verifySignUp = require("../middlewares/verifySignUp");

module.exports = function(app){
    app.use(function(req,res, next){
        res.header(
            "Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept"
        )
        next(); 
    });
    console.log('Executing'); 
    app.post("/api/auth/signup", [verifySignup.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], controller.signup); 
    app.post("/api/auth/signin", controller.signin); 
}; 