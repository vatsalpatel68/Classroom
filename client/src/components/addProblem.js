import React, { Component } from 'react';
import "./faculty.css";
import axios  from 'axios';

class addProblem extends Component{
    constructor(){
        
        super();
        this.state = {
            question : "",
            explanation : "",
            input : "",
            output : "",
            Difficulty : "",
            id : ""
         }
        this.changeQuestion = this.changeQuestion.bind(this);
    }

    componentDidMount(){
        this.setState({
            id : this.props.match.params.id
        })
    }

    changeQuestion(e){
        this.setState({
            question : e.target.value
        })
    }

    changeExplanation = (e) => {
        this.setState({
            explanation : e.target.value
        })
    }

    changeInput = (e) => {
        this.setState({
            input : e.target.value
        })
    }

    changeOutput = (e) => {
        this.setState({
            output : e.target.value
        })
    }

    changeDifficulty = (e) => {
        console.log(e.target.value);
        this.setState({
            Difficulty : e.target.value
        })
    }

    submitButton = (e) => {
        e.preventDefault();
        if(this.state.Difficulty !== null){
        axios.post("http://localhost:5000/faculty/addTask" , {
            question : this.state.question,
            explanation : this.state.explanation,
            input : this.state.input,
            output : this.state.output,
            Difficulty : this.state.Difficulty,
            id : this.state.id
        })
        .then(resFromServer => {
            if(resFromServer.data.message === "Successfully")
            {
                this.setState({
                    question : "",
                    explanation : "",
                    input : "",
                    output : "",
                    Difficulty : "",
                    collage : "",
                })
            }
            else
            {
                document.getElementById("answer").innerHTML = "There is a problem.";
            }
        }) 
    }
    else
    {
        document.getElementById("answer").innerHTML = "Please choose a Difficulty level.";
    }
    }


    render(){
        return(
            <React.Fragment>
                <form id = "inputForm" onSubmit = {this.submitButton}>
                    <label htmlFor = "question" id = "tagName">Question</label><br/>
                
                    <textarea id = "question" rows = "3" cols = "70"  placeholder = "Write a Question" value = {this.state.question} onChange = {this.changeQuestion} required /><br/>
                    <label htmlFor = "explanation" id = "tagName">explanation</label><br/>
                    <textarea id = "explanation" rows = "10" cols = "70" placeholder = "Write an Explanation" value = {this.state.explanation}  onChange = {this.changeExplanation} required/><br/>

                    <select onChange = {this.changeDifficulty} id = "selective-menu" required>
                        <option defaultChecked value="" className = "selective-option">Please choose a Difficulty Level:</option>
                        <option className = "selective-option" value = "easy">Easy</option>
                        <option className = "selective-option" value = "medium">Medium</option>
                        <option className = "selective-option" value = "hard">Hard</option>
                    </select>
                    <br/>

                    <label htmlFor = "input" id = "tagName">Input</label><br/>
                  
                    <textarea id = "input" rows = "3" cols = "30" placeholder = "Write an Input" value = {this.state.input}  onChange = {this.changeInput} required /><br/>
                    <label htmlFor = "output" id = "tagName">output</label><br/>
                    
                    <textarea id = "output" rows = "3" cols = "30" placeholder = "Write an Output" value = {this.state.output}  onChange = {this.changeOutput} required/><br/>
                    <button type = "submit" id = "submitButton">Add Task</button>
                    
                </form>
                <div id ="answer"></div>
            </React.Fragment>
        )
    }
}


export default addProblem;