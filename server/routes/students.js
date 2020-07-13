const express = require("express");
const route = express.Router();
const bodyParser = require('body-parser');
const passwordValidator = require("password-validator");
const cors  = require("cors");
var validator = require('validator');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cmd = require("node-cmd");

const fs = require("fs");
const Faculty = require("./faculty");
const { Route, modelForQuestions } = require("./faculty");
const { type } = require("os");
mongoose.connect("mongodb://localhost/classroom",{useNewUrlParser: true , useUnifiedTopology: true});



//Schema for Student Information.
let studentSchema  = mongoose.Schema({
    _id : String,
    name : String,
    username : String,
    password : String,
    collage : String,
    status : {
        type : String,
        default : "pending"
    },
    type : {
        type : String,
        default : "student"
    }
});

let studentModel = mongoose.model("student",studentSchema);



//Schema for fetch the collages name.

let InstituteSchema = mongoose.Schema({
    mentor : String,
    collage : String
})


let InstituteModel = mongoose.model("institute",InstituteSchema);




//for Validating the password.
var schema = new passwordValidator();
schema
.is().min(1)
.is().max(20)
.has().not().spaces();

//It will prevent cross-origin Resource sharing error.
route.use(cors());

//for fetch the Post Requests.
route.use(bodyParser.urlencoded({ extended: false }))
route.use(bodyParser.json())

var urlencodedParser = bodyParser.urlencoded({ extended: false })


route.post("/studentsignup",urlencodedParser,function(req,res){
    if(schema.validate(req.body.password))
    {
        if(validator.isEmail(req.body.username))
        {
            //here actual we perform our Task.
            const saltRounds = 10;
            let getName  = req.body.name;
            let getUsername = req.body.username;
            let getpassword = req.body.password;
            let getenrollment_no = req.body.enrollment_no;
            let collageName = req.body.collage;


            var checkId  = CheckIdIsPresent(getenrollment_no);
            checkId.then(res3 => {
                if(res3.length == 0)
                {
                    let checkUsername = checkUsernameIsPresentOrNot(getUsername);
                    checkUsername.then(res4 => {
                        if(res4.length == 0)
                        {
                            
                    bcrypt.hash(getpassword, saltRounds, function(err, hash) {
                        // Store hash in your password DB.
                        let query = new studentModel({
                            _id : getenrollment_no, 
                            name : getName,
                            password : hash,
                            username : getUsername,
                            collage : collageName
                        })
            
                       query.save(function(err,res2){
                            if(err){
                                console.log(err);
                                res.json({ message : err });                  
                            }
                            else{
                                res.json({ message : res2 });
                            }
                        }) 
                    });
                        }
                        else
                        {
                            res.json({message : "User with this Username is present"});
                        }
                    })
                   
                }
                else
                {
                    res.json({message : "User is present"});
                }
            })
        
                 

        }
        else
        {
            res.send("email is not valid");
        }
    }
    else{
            res.send("password is not valid");
    }
});

 async function CheckIdIsPresent(key)
{
    let query = await studentModel.find({ _id : key});
    return query;
}


async function checkUsernameIsPresentOrNot(user)
{
    let query = await studentModel.find({ username : user})
    return query;
}

route.post("/studentLogin",urlencodedParser,function(req,res){
    let pass = req.body.password;
    var getDataFromTheDb =  CheckIdIsPresent(req.body.enrollment_no);
    getDataFromTheDb.then(res2 => {
        if(res2.length > 0)
        {

            bcrypt.compare(pass, res2[0].password, function(err, result) {
                if(result)
                {
                    //when user enters a Right password.
                    res.json({message  : "User is present."});
                }   
                else
                {
                    //when password is incorrect.
                    res.json({message : "Invalid password"});
                }
            });
        }
        else
        {
            res.json({
                message : "User is not present."
            });
        }
    })

    
})


async function getInstituteName()
{
    var a = [];
    let query = await InstituteModel.find({});
    query.map((once,i) => {
        let sampleObject = {
            index : i,
            name : once.collage
        }
        a.push(sampleObject)
    })
    return a;
}


//this route send the name of the collages.
route.get("/instituteList",function(req,res){

    var nameOfInstitutes = getInstituteName();
    
    nameOfInstitutes.then(resFromFunc => res.json(resFromFunc));
    
    
})

//this route is for verify the user.

route.post("/verify" ,async function(req,res){

    let query  = await studentModel.find({ _id : req.body.id});
    if(query[0].status == "pending")
    {
        res.send("notVerify");
    }
    else
    {
        res.send("verify");
    }

    
})

//get Questions from the database.

async function getQuestionsFromDb(){
    let query = await Faculty.modelForQuestions.aggregate([{$lookup : {from : "faculties" , localField : "postBy" , foreignField : "_id" , as : "facultydetail"}}]);
    return query;
}

//this will send a problem which are not submitted by the user;

route.post("/getProblems",async function(req,res){
    let clientId = req.body.id;
    let questions = getQuestionsFromDb();
    let questionsList = [];
    questions.then(QueFromFunc => {
        QueFromFunc.forEach(element => {
            
            if(!element.submitted.includes(clientId)){
                //this are the sorted Question list for that users.
                questionsList.push(element);
            }
        });
        res.json({"questions" : questionsList}); 
    })
       
})


async function getBookInformation(book_id)
{
    let query = await modelForQuestions.aggregate([{$match : { "_id" : mongoose.Types.ObjectId(book_id) }},{ $lookup  : {from : "faculties" , localField : "postBy" , foreignField : "_id" , as : "faculty_data"}}]);
    return query;
}

route.post("/problemDetail" , function(req,res){
    let book = getBookInformation(req.body.que_id);
    book.then(bookDetail => {
        res.json({detail : bookDetail});
    })
}) 

//route for compile java Code.
route.post("/java/compileCode" ,async function(req,res){
    let code =  req.body.code;
    let studentId = req.body.studentId;
    let question_id = req.body.question_id;

    let File_name = studentId + question_id;

    fs.mkdir(__dirname + "/" + File_name ,function(err,data){
        fs.writeFile(`${__dirname}/${File_name}/${File_name}.java` , code , function(err2,data2){
            cmd.get(
                `javac routes/${File_name}/${File_name}.java`,
                function(err2,data2,stderr2)
                {
                    if(err2)
                    {
                        res.json({
                            message : stderr2,
                            error : true
                        })
                    }

                    else
                    {
                       cmd.get(
                           `cd ./routes/${File_name}
                            java classroom
                           `
                           ,function(err3,data3,stderr3)
                           {
                               if(err3)
                               {
                                   res.json({
                                       message : stderr3,
                                       error : true
                                   })
                               }
                               else
                               {
                                    res.json({
                                        message : data3,
                                        error : false
                                    })
                               }
                           }
                       )
                    }
                    

                }
            )
        })
    });
    
    //First we have to make a seperate File in Shared Directory.
    //Then we have to jumpp to that file.
    //then we have to compile that file.
    //and then unlink that File.
})

//route for compile python code.   
route.post("/python/compileCode" , function(req,res){
    let code = req.body.code;
    let studentId = req.body.studentId;
    let question_id = req.body.question_id;

    let FileName = studentId + question_id;

    fs.mkdir(__dirname + "/" + FileName ,function(err,data){
    fs.writeFile(`${__dirname}/${FileName}/${FileName}.py` , code , function(err2,data2){
		cmd.get(
			`cd ./routes/${FileName}
			 python ${FileName}.py	
			`
		,function(err2,data2,stderr2)
		{
			if(err2)
			{
				res.json({
					message : stderr2,
					error : true			
				
				})
			}
			else
			{
				
				res.json({
					message : data2,
					error : false			
				
				})
			}
		})
	})	
    })

})

//Define Schema and Model for store the code on a Students.
const schemaForSubmitQuestions  = mongoose.Schema({
	_id : String,
	student_id : String,
	question_id : String,
	review : {
		type : String,
		default : false	
	},
	score : {
		type : String,
		default : 0	
	},
	code : String,
	collageName : String
})

const modelForSubmitQuestions = mongoose.model("submissions" , schemaForSubmitQuestions);

//From Route faculty.js;

const schemaForQuestions = Faculty.schemaForQuestions;

const facultyModelForQuestions  = mongoose.model("questions",schemaForQuestions);

async function insertCodeToDb(getcode  , getstudentId  , getquestion_id)
{

	let studentDetail = await studentModel.find({ _id : getstudentId});	
	let query  = new modelForSubmitQuestions({
		_id : getstudentId + getquestion_id,
		student_id : getstudentId,
		question_id : getquestion_id,
		code : getcode,
		collageName : studentDetail[0].collage
	})
	//we use upserting for this type of query.

	let docId = getstudentId + getquestion_id; 

	let ans = await modelForSubmitQuestions.findOneAndUpdate({ _id : docId} , {code : getcode , review : false , score : 0});
	if(ans == null)
	{
		//this is the first time.
		ans  = await query.save();
	}
	
	return ans;
}

async function checkInsertOrNot(student_id , question_id)
{
	let query = await facultyModelForQuestions.find({ _id : question_id , submitted : student_id});
	return query.length;
		
}


async function submitUserInDb(student_id , question_id)
{
	let query = await facultyModelForQuestions.findOneAndUpdate({ _id : question_id },{ $push : {"submitted" : student_id}});
	return query;
}


route.post("/java/saveCode" , async function(req,res){
	let code  = req.body.code;
	let studentId = req.body.studentId;
	let question_id = req.body.question_id;


	let insertIntoDb = insertCodeToDb(code , studentId  , question_id);
	insertIntoDb.then(resFromDb => {
		//now time for update into the 'questions' collection.
		let checkUpdateorNot  = checkInsertOrNot(studentId , question_id);
		checkUpdateorNot.then(result => {
			//if length is '0' then it is  not inserted.		
			if(result == 0)
			{
				//when user is not inserted.
				let changeStatus = submitUserInDb(studentId , question_id);
				changeStatus.then(updated => {
					res.send("Submitted");	
				})
			}
			else{
				res.send("submitted");			
			}
			
		})
					
	    })
	})	


async function getStudentProblems(getstudent_id)
{
	let query = await  facultyModelForQuestions.aggregate([{$match : { "submitted" : getstudent_id}} , {$lookup : {from : "faculties" , localField : "postBy" , foreignField : "_id" ,as : "facultydetail"}}]);
	return query;
}


//get problems of a student.
route.post("/showSubmittedProblems" , function(req,res){
	let student_id  = req.body.student_id;
	let data = getStudentProblems(student_id);
	data.then(problems =>{
		res.json({ data : problems })
	})
})

//when student is submit the code at that time they can fetch data from the this endpoint.
async function getBookInformationSubmitted(book_id)
{
    let query = await modelForQuestions.aggregate([{$match : { "_id" : mongoose.Types.ObjectId(book_id) }},{ $lookup  : {from : "submissions" , localField : "_id.str" , foreignField : "question_id.str" , as : "code_data"}}]);
    return query;
}

route.post("/problemDetailSubmitted" , function(req,res){
    let book = getBookInformationSubmitted(req.body.que_id);
    book.then(bookDetail => {
        res.json({detail : bookDetail});
    })
}) 

module.exports = {
    studentModel : studentModel,
    studentSchema : studentSchema,
    schemaForSubmitQuestions : schemaForSubmitQuestions,
    route : route,
    
}

