const express = require("express");
const app = express();

const PORT = process.env.PORT | 5000;

var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var urlencodedParser = bodyParser.urlencoded({ extended: false })


//Define a Student Route.
const students = require("./routes/students");
app.use("/students",students.route);


//Define a Faculty Route.
const Faculty = require("./routes/faculty");
app.use("/faculty",Faculty.Route);


app.listen(PORT,()=> console.log("on port 5000"))