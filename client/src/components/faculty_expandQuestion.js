import React , { Component } from 'react';
import axios from 'axios';


class Faculty_ExpandQuestion extends Component{

	constructor(){
		super();
		this.state = {
			question : "",
			explanation : "",
			input : "",
			output : "",
			Difficulty : ""
		}

	}

	componentWillMount(){
		axios.post("http://localhost:5000/faculty/expandQuestion",{
			question_id : this.props.match.params.question_id
		})
		.then(resFromBe => {
			this.setState({
				question : resFromBe.data.data[0].question,
				explanation : resFromBe.data.data[0].explanation,
				input : resFromBe.data.data[0].input,
				output : resFromBe.data.data[0].output,
				Difficulty : resFromBe.data.data[0].Difficulty
			
			})
		})


	}
	render(){
		return(
			<React.Fragment>		
				<div className = "problem_heading">Question :</div>
				<div className = "problem_question">{this.state.question}</div>	
				<div className = "problem_heading">Explanation :</div>
				<div className = "problem_explanation">{this.state.explanation}</div>	
				<div className = "problem_heading">Difficulty :</div>
				<div className = "problem_explanation">{this.state.Difficulty}</div>	
				<div className = "problem_heading">Input :</div>
				<div className = "problem_input">{this.state.input}</div>
				<div className = "problem_heading">Output :</div>
				<div className = "problem_output">{this.state.output}</div>
			</React.Fragment>
		)


	}


}


export default Faculty_ExpandQuestion;
