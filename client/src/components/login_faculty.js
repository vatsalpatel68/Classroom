import React, { Component } from 'react';
import axios from 'axios';  
import Cookies from 'js-cookie';
class LoginFaculty extends Component{

    constructor(){
        super();
        this.state = {
            employee_number : String,
            password : String
        }
    }

    changeEmployeeNumber = (e) => {
        this.setState({
            employee_number : e.target.value
        })
    }

    changePassword = (e) => {
        this.setState({
            password : e.target.value
        })
    }

    formSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5000/faculty/facultyLogin",{
            employee_number : this.state.employee_number,
            password : this.state.password
        })
        .then(resFromServer => {
            if(resFromServer.data.message === "User with that username is  not present")
            {
                document.getElementById("answer").innerHTML = "User with that Username is not present";
                this.setState({
                    password : "",
                    employee_number : ""
                })
            }
            else if(resFromServer.data.message === "Invalid password")
            {
                document.getElementById("answer").innerHTML = "Invalid password";
                this.setState({
                    password : "",
                    employee_number : ""
                })
            }
            else
            {
                Cookies.set("data" , "faculty");
                this.setUrl();
            }
           
        })
        .catch(err => {
            console.log(err);
        })
        

    }


    setUrl = () =>{
        this.props.history.push("/faculty/"+this.state.employee_number);
    }

    render(){
        return(
            <React.Fragment>
                <form onSubmit = {this.formSubmit} >
                  <input type = "text" name = "employee_number" value = {this.state.employee_number} onChange = {this.changeEmployeeNumber} placeholder = "Please enter Employee Number" required/><br/>
                  <input type = "password" name = "password" value = {this.state.password} onChange = {this.changePassword} placeholder = "Please enter a Password" required/><br/> 
                    <button type="submit">Login</button> 
                    <div id="answer"></div>
                </form>
            </React.Fragment>
        )
    }
}

export default LoginFaculty;