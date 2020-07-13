import React , { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./faculty.css";
class Faculty_ShowAll extends Component{

	constructor(){
		super();
		this.state = {
			data : [],
			loading : false
		}	
	
	}

	componentWillMount(){
		axios.post("http://localhost:5000/faculty/showAllProblems")
		.then(resFromBe => {
			this.setState({
				data : resFromBe.data.data,
				loading : true		
			})		
		})

	}

	render(){

		let one_question = null;
		if(this.state.data.length !== null)
		{
			one_question = this.state.data.map(once => {
				return(
					<Link to = {"/faculty/expandedQuestion/" + this.props.match.params.id + "/" + once._id}>
			 	<li className = "list_container">
				
					<div className = "list_question">Que : {once.question}</div>
					<div className = "list_submitted_by">Difficulty : {once.Difficulty}</div>
				</li>
				</Link>				
				)		
			})
		}
		else
		{
			one_question = "<h1>No question is posted yet.</h1>"
		}
	
		return(
			<React.Fragment>
				{this.state.loading?
                		<ul className = "question_list">
                		{one_question}
                		</ul>:<h1>{null}</h1>}
			</React.Fragment>		
		)
	}

}


export default Faculty_ShowAll;
