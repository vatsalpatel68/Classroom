const express = require("express");
const Route = express.Router();
const cors = require("cors");
const bcrypt = require("bcrypt");
const validator  = require("validator");
const passwordValidator = require("password-validator");

//for CORS
Route.use(cors());

//For manipulate POST request.
var bodyParser = require('body-parser')
Route.use(bodyParser.urlencoded({ extended: false }))
Route.use(bodyParser.json())
var urlencodedParser = bodyParser.urlencoded({ extended: false })


//Define a Schema for the Faculty.

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/classroom",{useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);



//from student.js

const student = require("./students");

//define a Schema and model.
var SchemaForFaculty = mongoose.Schema(
    {
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
            default : "faculty"
        }
        
    })

var modelForFaculty = mongoose.model("faculty",SchemaForFaculty);


//for Validating the password.
var schema = new passwordValidator();
schema
.is().min(1)
.is().max(20)
.has().not().spaces();


//Schema and Model for institute.

var schemaForInstitute =  mongoose.Schema({
    mentor : String,
    mentor_email : String,
    collage : String,
})

var modelForInstitute = mongoose.model("institutes",schemaForInstitute);



async function checkidispresentornot(keyValue)
{
    let query = await modelForFaculty.find({ _id : keyValue});
    return query;
}

async function checkUsernameIsPresentOrNot(keyValue)
{
    let query = await modelForFaculty.find({ username : keyValue});
    return query;
}


//Schema for Know faculty is Mentor of that collage or Not.

Route.post("/facultySignup",urlencodedParser, function(req,res){
    let getname = req.body.name;
    let getusername = req.body.username;
    let getpassword = req.body.password;
    let getemployee_number = req.body.employee_number;  
    let getCollage = req.body.collage;

    if(schema.validate(getpassword)){
        if(validator.isEmail(getusername)){
            let checkID = checkidispresentornot(getemployee_number);
            checkID.then(IdIsPresentOrNot => {
                if(IdIsPresentOrNot.length == 0)
                {
                    let checkUserName = checkUsernameIsPresentOrNot(getusername);
                    checkUserName.then(UsernameIsPresentOrNot => {
                        if(UsernameIsPresentOrNot.length == 0)
                        {
                            //Here we fire a Query.
                            const saltround = 10;
                            bcrypt.hash(getpassword,saltround,function(err,hash){
                                let query = new modelForFaculty({
                                    _id : getemployee_number,
                                    name : getname,
                                    username : getusername,
                                    password : hash,
                                    collage : getCollage
                                });

                                query.save(async function(err,resfromDB){
                                    if(err)
                                    {
                                        //when error is occur.
                                        res.json({message : "error"});
                                    }
                                    else
                                    {
                                        //when query is fire successfully.
                                        res.json({ message : "Done"}); 
                                    }
                                })

                            })
                        }
                        else
                        {
                            //When User with that Username is present.
                            res.json({message : "User with that Username is present"});
                        }
                    })
                }
                else
                {
                    //when User with that ID is present.
                    res.json({message : "User is already present"});
                    
                }
            })
        }
        else
        {
            //when username is incorrect.
            res.json({message : "Username is not valid"});
        }
    }
    else
    {
        //when password is not as per Schema.
        res.json({message: "password is incorrect"});
    }

    let idispresentornot = checkidispresentornot(getemployee_number);
    idispresentornot.then(resForid => {
        
    })

})


async function checkEmployeeNumber(keyValue){
    let query = modelForFaculty.find({_id : keyValue});
    return query;
}



Route.post("/facultyLogin",urlencodedParser,function(req,res){
    //this will handle Login activity.
    let getemployee_number = req.body.employee_number;
    let password = req.body.password;

    let checkEmployee_number = checkEmployeeNumber(getemployee_number);
    checkEmployee_number.then(Employee_numberIsValidOrNot => {
        if(Employee_numberIsValidOrNot.length != 0)
        {
            //Now time for check password is correct or not.
            bcrypt.compare(password, Employee_numberIsValidOrNot[0].password, function(err, result) {
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
        else{
            //when User with that username is not present.
            res.json({message : "User with that username is  not present"});
        }
    })

})

var schemaForQuestions = mongoose.Schema({
    question : String,
    explanation : String,
    input : String,
    output : String,
    Difficulty : String,
    collageName : String,
    postBy : String,
    submitted : {
        type : Array,
    }
});

var modelForQuestions = mongoose.model("questions",schemaForQuestions);

async function getCollageId(getId){
    let collageName = await modelForFaculty.find({ _id : getId } , {collage : 1});
    return collageName;
}

Route.post("/addTask",urlencodedParser,async function(req,res){
    let getQuestion = req.body.question;
    let getExplanation = req.body.explanation;
    let getInput = req.body.input;
    let getOutput = req.body.output;
    let getDifficulty = req.body.Difficulty;
    let getid =  req.body.id;
    let IdOfCollage  = getCollageId(getid);
    IdOfCollage.then(collage => {
        let AddQuestion = new modelForQuestions({
            question : getQuestion,
            explanation : getExplanation,
            input : getInput,
            output : getOutput,
            Difficulty : getDifficulty,
            postBy : getid,
            collageName : collage[0].collage
        })
    
        AddQuestion.save(function(err,resFromDb){
            if(err){

                res.json({message : "error"});
            }
            else
            {
                res.json({message : "Successfully"});
            }
        })
    })
   
})

async function changeTheStatusToMentor(mentorID)
{
    await modelForFaculty.findByIdAndUpdate({ _id : mentorID } , { status : "mentor"});
}

async function getFacultyWithPendingStatus(ans , collageName)
{
    let faculty = await modelForFaculty.find({ status : "pending" , collage : collageName });
    faculty.map(once => {
        
        ans.push(once);
        
        })
    return ans;
}


async function getStudentWithPendingStatus(ans , collageName)
{
    let StudentModelForSample = mongoose.model("student" , student.studentSchema);
    let studentData = await StudentModelForSample.find({ status : "pending" , collage : collageName});
    studentData.map(once => {
        
    ans.push(once);
    
    })
    return ans;
}

Route.post("/joiningRequest",urlencodedParser,async function(req,res){
    //let query = await modelForFaculty.find({});

    let query = await modelForFaculty.aggregate([{$match : {  _id : req.body.id }},{$lookup : {from : "institutes" , localField : "username" , foreignField : "mentor_email" , as : "data"}}]);
    if(query[0].data.length > 0)
    {
        
        //this code will execute when faculty is mentor of that collage.
        //if mentor is present then he/she can approve both faculty as well as students.


        //this will change the status of mentor "pending" to mentor;
        //this changing of status will help when we get a data of faculties which has a "pending" status;

        await changeTheStatusToMentor(req.body.id);
      
        let ans = [];
        if(query[0].status !== "pending"){
        ans =  getFacultyWithPendingStatus(ans , query[0].data[0].collage);
	    ans.then(resFromFaculty => {
            resFromFaculty =  getStudentWithPendingStatus(resFromFaculty , query[0].data[0].collage);
            resFromFaculty.then(getFinalData => {
                res.json({data : getFinalData});
            })
	    })
//        
         
        }
        
        
    }
    else
    {
        //this code will execute when faculty is not a  mentor of that collage.
        //he/she can approve only student not other faculty.
        let ans = [];
        if(query[0].status !== "pending"){
   //     ans = await getStudentWithPendingStatus(ans , query[0].collage);
        }
        res.json({data : ans});
    } 
})


Route.post("/verify",urlencodedParser,async function(req,res){
    let query = await modelForFaculty.find({ _id : req.body.id });	
    if(query[0].status == "pending"){
        res.send("notVerify");
    }
    else
    {
        res.send("verify");
    }
})


Route.post("/approveReject",urlencodedParser,async function(req,res){
    let id  = req.body.id;
    let type = req.body.type;
    let process = req.body.process;

    let response = null;
    if(type == "faculty")
    {
        if(process == "approve")
        {
            //Approve that faculty.
            response = await modelForFaculty.findByIdAndUpdate({ _id : id }, { status : "Approved"});
        }
        else
        {
            //Reject that request for faculty.
            response = await modelForFaculty.findByIdAndRemove({ _id : id});
        }
    }
    else
    {
        if(process == "approve")
        {
            //Apporve that student.
            let StudentModelForSample = mongoose.model("student" , student.studentSchema);
            response = await StudentModelForSample.findOneAndUpdate({ _id : id },{ "status" : "Approved"})
        }
        else
        {
            //Reject that student.
            let StudentModelForSample = mongoose.model("student" , student.studentSchema);
        
            response = await StudentModelForSample.findByIdAndRemove({ _id : id});
        }
    }
    res.json(response);    
})

async function getAllQuestionWithInfo(query,res)
{
	let arr = [];
	await query.map(async function(once , position){
		let question_info = await modelForQuestions.find({ _id : once.question_id});
		let buffer = {
			question : question_info[0].question,
			explanation : question_info[0].explanation,
			input : question_info[0].input,
			output : question_info[0].output,
			Difficulty : question_info[0].Difficulty,
			postBy : question_info[0].postBy,
			code : once.code,
			student_id : once.student_id,
			question_id : question_info[0]._id

		}
		arr.push(buffer);
		
		if(position == query.length -1)
		{
			res.json({data : arr})	
			return arr;		
		}
		
	})


}

async function getQuestionsWithDetails(res , getcollageName){
	var sampleModel  = mongoose.model( "submissions" , student.schemaForSubmitQuestions);
	let query = await sampleModel.find({ review : false , collageName : getcollageName});
	let allData = getAllQuestionWithInfo(query , res);
	
	allData.then(sendingInfo => {
			
	})
	return query;
}

Route.post("/submissionReview" , async function(req,res){
	let faculty_id = req.body.faculty_id;
	let facultyDetail = await modelForFaculty.find( {"_id" : faculty_id });
	let collageName = facultyDetail[0].collage;
	let data  = getQuestionsWithDetails(res , collageName );

})


Route.post("/ReviewQuestion" , async function(req,res){
	let getFaculty_id = req.body.faculty_id;
	let getStudent_id = req.body.student_id;
	let getQuestion_id = req.body.question_id;
	
	let submissionModel  = mongoose.model( "submissions" , student.schemaForSubmitQuestions);
	let fromSubmissionDb = await submissionModel.find({ student_id : getStudent_id , question_id : getQuestion_id});
	let fromQuestionDb = await modelForQuestions.find({ _id : getQuestion_id});
	res.json({
		studentData : fromSubmissionDb[0],
		questionData : fromQuestionDb[0] 	
	});
})


Route.post("/approveCode" ,async function(req,res){
	let getFaculty_id = req.body.faculty_id;
	let getStudent_id = req.body.student_id;
	let getQuestion_id = req.body.question_id;
	let getMarks = req.body.marks;
	let submissionModel  = mongoose.model( "submissions" , student.schemaForSubmitQuestions);
	let update = await submissionModel.findOneAndUpdate( { student_id : getStudent_id , question_id : getQuestion_id} , { score : getMarks , review : true });
	console.log(update);	
	res.send("updated");
})


//for show all problems component.


Route.post("/showAllProblems" ,async function(req,res){
		let questions  = await modelForQuestions.find({});
		res.json({data : questions});	
})


Route.post("/expandQuestion", async function(req,res){
	console.log(req.body.question_id);
	let question = await modelForQuestions.find({ _id : req.body.question_id});
	res.json({ data : question });
})

module.exports = {
    Route : Route,
    modelForQuestions : modelForQuestions,
    schemaForQuestions : schemaForQuestions
}
