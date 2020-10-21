const express = require('express'); 
const bodyParser = require("body-parser"); 
const cors = require("cors"); 

const app = express(); 

var corsOptions = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOptions)); 

// parse requests of content-type - application/json
app.use(bodyParser.json()); 

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true})); 

const db = require('./app/models'); 
const Role = db.role; 
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(`Connected to the database!`); 
    })
    .catch(err => {
        console.log(`Cannot connect to the database!`, err); 
        process.exit(); 
    });

function initial(){
    Role.estimatedDocumentCount((err,count) => {
        if(!err && count === 0){
            new Role({name: "user"})
                .save(err => {
                    if(err){
                        console.log("error", err); 
                    }
                    console.log(`added 'user' to roles collection`); 
                }); 

            new Role({name: "moderator"})
                .save(err => {
                    if(err){
                        console.log("error", err); 
                    }
                    console.log(`added 'moderator' to roles collection`); 
                }); 
            
            new Role({name: "admin"})
                .save(err => {
                    if(err){
                        console.log("error", err); 
                    }
                    console.log(`added 'admin' to roles collection`); 
                }); 
        }
    }); 
}


app.get("/", (req, res) => {
    res.json({message: "Welcome to bezkoder application. "});
}); 

require('./app/routes/tutorial.routes')(app); 

const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`); 
}); 