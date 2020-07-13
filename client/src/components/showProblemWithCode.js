import React , { Component } from 'react';
import axios from 'axios';

class ShowProblemWithCode extends Component{

    constructor(){
        super();
        this.state = {
            question : "",
            explanation : "",
            input : "",
            output : "",
            button : false,
            Difficulty : ""
        }
    }

    componentWillMount(){
        axios.post("http://localhost:5000/students/problemDetailSubmitted" , {
            que_id : this.props.match.params.question_id   
        })
        .then(resFromBe => {
	//console.log(resFromBe.data);
	this.setState({
                question : resFromBe.data.detail[0].question,
                explanation : resFromBe.data.detail[0].explanation,
                input : resFromBe.data.detail[0].input,
                output : resFromBe.data.detail[0].output,
                Difficulty : resFromBe.data.detail[0].Difficulty,
                button : true,
                

            })

	resFromBe.data.detail[0].code_data.map(once => {
		if(once.question_id === this.props.match.params.question_id && once.student_id === this.props.match.params.id)
		{
			this.setState({
				code : once.code
			})			
		}	
	})
            
        })
    }


    change = (e) =>{ 
		this.setState({
			code : e.target.value	
		})
	}
	

    render(){
	console.log(this.state.code)
        return(
            <React.Fragment>
                {this.state.button ?
                <React.Fragment>
                <div className = "Question_container">
                    <h1 className = "heading">Question</h1>
                    <div className = 'ex_questionName'>{this.state.question}</div>
                    <h1 className = "heading">Explanation</h1>
                    <div className = 'ex_explanation'>{this.state.explanation}</div>
                    <h1 className = "heading">Input</h1>
                    <div className = 'ex_input'>{this.state.input}</div>
                    <h1 className = "heading">Output</h1>
                    <div className = 'ex_output'>{this.state.output}</div>
		    <h1 className = "heading">Code</h1>
		    <textarea className = "code_input" readonly = "" onChange = {this.change}value = {this.state.code}>{this.state.code}</textarea>
                </div>
		</React.Fragment>
                :<h1>{null}</h1>}
            </React.Fragment>
     
    )
}

}
export default ShowProblemWithCode;
