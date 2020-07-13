import React , { Component } from 'react';
import axios from 'axios';


class ReviewQuestion extends Component{
	constructor()
	{
		super();
		this.state = {
			studentData : {},
			questionData : {},
			loading : false	,
			marks : ''	
		}		
	}


	componentWillMount(){
		axios.post("http://localhost:5000/faculty/ReviewQuestion" , {
			question_id : this.props.match.params.question_id,
			student_id : this.props.match.params.student_id,
			faculty_id : this.props.match.params.id		
		}).then(resFromBe => {	
			this.setState({
				studentData : resFromBe.data.studentData,	
				questionData : resFromBe.data.questionData,
				loading : true
			})
		})
	
	}

	inRange = (x, min, max) => {
    			return ((x-min)*(x-max) <= 0);
	}
	
	changeMarks = (e) => {
		this.setState({
			marks : e.target.value
		})
	}

	reviewCode = (e) => {
		if(this.inRange(parseInt(this.state.marks) , 0 , 10))
		{
			//here we perform main operation.
			axios.post("http://localhost:5000/faculty/approveCode",{
				question_id : this.props.match.params.question_id,
				student_id : this.props.match.params.student_id,
				faculty_id : this.props.match.params.id,
				marks : this.state.marks
			})
			.then(resFromBe => {
				if(resFromBe.data === "updated")
				{
					alert("Review Successfully");				
				}	
			})	
		}
		else
		{
			alert("please enter a valid marks");
		}
	}
	
	render(){
					
		return(
			<React.Fragment>
				<div className = "problem_heading">Question :</div>
				<div className = "problem_question">{this.state.questionData.question}</div>	
				<div className = "problem_heading">Explanation :</div>
				<div className = "problem_explanation">{this.state.questionData.explanation}</div>	
				<div className = "problem_heading">Input :</div>
				<div className = "problem_input">{this.state.questionData.input}</div>
				<div className = "problem_heading">Output :</div>
				<div className = "problem_output">{this.state.questionData.output}</div>
				<div className = "problem_heading">Code :</div>
				<textarea className = "problem_code" readonly = "" value = {this.state.studentData.code}></textarea>

				<input type='number' className = "problem_marks"  value = {this.state.marks} onChange = {this.changeMarks} placeholder = "Please enter a marks out of 10"/><br/>
				<button type='submit' className = "problem_button" onClick = {this.reviewCode}>Review Code</button>
			</React.Fragment>	
	)
}
}



export default ReviewQuestion;
