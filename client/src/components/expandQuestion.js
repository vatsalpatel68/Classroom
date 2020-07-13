import React , { Component } from 'react';
import axios from 'axios';
import CompileCode from './compileCode';

class ExpandQuestion extends Component{

    constructor(){
        super();
        this.state = {
            question : "",
            explanation : "",
            input : "",
            output : "",
            button : false,
            Difficulty : "",
            faculty_name : ""
        }
    }

    componentWillMount(){
        axios.post("http://localhost:5000/students/problemDetail" , {
            que_id : this.props.match.params.question_id   
        })
        .then(resFromBe => {
            this.setState({
                question : resFromBe.data.detail[0].question,
                explanation : resFromBe.data.detail[0].explanation,
                input : resFromBe.data.detail[0].input,
                output : resFromBe.data.detail[0].output,
                Difficulty : resFromBe.data.detail[0].Difficulty,
                button : true,
                faculty_name : resFromBe.data.detail[0].faculty_data[0].name

            })
            
        })
    }


    render(){
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
                </div>
                    <CompileCode studentId = {this.props.match.params.id} question_id = {this.props.match.params.question_id}/>
                </React.Fragment>
                :<h1>{null}</h1>}
            </React.Fragment>
            )
    }
}


export default ExpandQuestion;