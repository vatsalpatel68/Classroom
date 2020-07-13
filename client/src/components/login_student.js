import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
class LoginStudent extends Component{


    constructor(){
        super();
        this.state = {
            EnrollmentNo : "",
            password : ""
        }
    }

    changeEnrollmentNo = (e) =>{
        this.setState({
            EnrollmentNo : e.target.value
        })
    }

    changePassword = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    

    submitForm = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/students/studentLogin",{
            enrollment_no : this.state.EnrollmentNo,
            password : this.state.password
            })
            .then(res => {
                if(res.data.message === "User is present.")
                {
                    Cookies.set("data" , "student");
                    this.setUrl();
                    
                }
                else
                {
                    document.getElementById("answer").innerHTML = "EnrollmentNo and Password is not matched";
                    this.setState({
                        EnrollmentNo : "",
                        password : ""
                    })
                }
                
            })

      
        
    }
    setUrl = () =>{
        this.props.history.push("/students/"+this.state.EnrollmentNo);
    }

    render(){
        return(
            <React.Fragment>
                <form onSubmit = {this.submitForm}>
                    <input type = "text" name = "enrollmentno" value = {this.state.EnrollmentNo} onChange = {this.changeEnrollmentNo} placeholder="Please enter a enrollment no" required/><br/>
                    <input type = "password" name = "password" value = {this.state.password} onChange = {this.changePassword} placeholder = "Please enter a Password" required/><br/>
                    <button type = "submit"> Submit </button>
                    <div id = "answer"></div>
                </form>

            </React.Fragment>
        )
    }
}

export default LoginStudent;