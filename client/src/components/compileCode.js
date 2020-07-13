import React , { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import $ from "jquery";
class CompileCode extends Component{

    constructor(){
        super();
        this.state = {
            inputJava : `import java.util.*;
            class classroom{
                            public static void main(String[] args)
                            {
                                  System.out.println("hello world");
                            }
            }`,
            inputPython : `print("hello world")`,
            output : "",
            language : "java",
            error : false
        }
    }

    inputInJava = (e) => {
        this.setState({
            inputJava : e.target.value
        })
    }

    inputInPython = (e) =>{
        this.setState({
            inputPython : e.target.value
        })
    }

    changeLanguage = (e) => {
        this.setState({
            language : e.target.value,
	    output : ""
        })
	$(".code_output").css("color" , "black")

    }

    pressCompileButton = (e) =>{
        e.preventDefault();
        
        if(this.state.language === "java")
        {
            //api call for java code.
            this.setState({
                output : ""
            })
            axios.post("http://localhost:5000/students/java/compileCode",{
                code : this.state.inputJava,
                studentId : this.props.studentId,
                question_id : this.props.question_id
            })
            .then(resFromBe => {
                this.setState({
                    output : resFromBe.data.message,
                    error : resFromBe.data.error
                })

		if(this.state.error){
			$(".code_output").css("color","red");	
		}
		else{
			$(".code_output").css("color","green")			
		}
            })

        }
        else
        {
            //api call for python.
              //api call for java code.
              axios.post("http://localhost:5000/students/python/compileCode",{
                code : this.state.inputPython,
                studentId : this.props.studentId,
                question_id : this.props.question_id
            })
            .then(resFromBe => {
                   this.setState({
                    output : resFromBe.data.message,
                    error : resFromBe.data.error
                })

		if(this.state.error){
			$(".code_output").css("color","red");	
		}
		else{
			$(".code_output").css("color","green")			
		}
            })
        }
    }

    saveCode = (e) => {
	e.preventDefault();
	//if output is ok then he/she can able to send the question.

	if(this.state.output){
		$(".codeSaveWarn").html("");	
		if(!this.state.error)
		{
			//here we send data to the backend.
			$(".codeSaveWarn").html("");
			axios.post("http://localhost:5000/students/java/saveCode",{
				code : this.state.inputJava,
				studentId : this.props.studentId,
                		question_id : this.props.question_id,
			})
			.then(resFromBe =>{
							
			})
			
		}	
		else
		{
			$(".codeSaveWarn").html("Please Solve the error First");
			$(".codeSaveWarn").css("color","red");		
		}		
        }
	else{
		//when user is not compile the code.
		$(".codeSaveWarn").html("Please Compile the code first.");
		$(".codeSaveWarn").css("color","red");
				
	}
	}

    render(){
        return(
            <React.Fragment>
                <div className = "compile_container">
                    <form>
                        <select className = "language_select" required onChange = {this.changeLanguage}>
                            <option selected value = "java">java</option>
                            <option value = "python">python</option>    
                        </select><br/>
                    <textarea className = "code_input" required value = {this.state.language === "java" ? this.state.inputJava : this.state.inputPython} onChange = {this.state.language === "java" ? this.inputInJava : this.inputInPython} placeholder = "//write your code"></textarea><br/>
                    <button type = "submit" className = "compile_code" onClick = {this.pressCompileButton}>Compile and Run</button><br/>
                    <label for="code_output">Output</label><br/>
                    <textarea className = "code_output" id = "codeOutput" value = {this.state.output}placeholder = "//output is shown here"></textarea><br/>
		    <h3 className = "codeSaveWarn"></h3>
		    <button onClick = {this.saveCode} className = "compile_code">Save</button><br/>
                    </form>
                    </div>
            </React.Fragment>
        )
    }
}

export default CompileCode;
