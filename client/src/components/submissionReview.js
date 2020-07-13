import React , { Component } from 'react';
import axios from 'axios';
import "./faculty.css";
import { Link } from 'react-router-dom';
class SubmissionReview extends Component{

	constructor(){
		super();
		this.state = {
			data : [],
			loading : false
		}	

	}

	componentWillMount(){
		axios.post("http://localhost:5000/faculty/submissionReview",{
			faculty_id : this.props.match.params.id		
		})
		.then(resFromBe => {
			this.setState({
				data : resFromBe.data.data,
				loading : true			
							
			})	
		})
	}

	render(){
		console.log(this.state.data.length)
		let one_question = null;
		if(this.state.data.length !== 0){
			one_question  = this.state.data.map(once => {
				return(
                                <Link to = {"/faculty/ReviewQuestions/" + this.props.match.params.id + "/" + once.question_id + "/" + once.student_id}>
			 	<li className = "list_container">
				
					<div className = "list_question">Que : {once.question}</div>
					<div className = "list_submitted_by">student ID : {once.student_id}</div>
				</li>
				</Link>	
								 
				)		
			})
			
		}
		else
		{
		 	one_question = "<li><h1>No problem is left for review</h1></li>";		
		}
	return(
	
	 <React.Fragment>
                {this.state.loading?
                <ul className = "question_list">
                {one_question}
                </ul>:<h1>{null}</h1>}
		{this.state.data.length === 0?
		<h1>No Problem is left For review</h1>:<h1>{null}</h1>}
            </React.Fragment>		
	)	
	}

}


export default SubmissionReview;
