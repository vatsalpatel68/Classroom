import React, { Component } from 'react';
import axios from 'axios';
import InstituteList from './InstituteList';

class SignupFaculty extends Component{
    constructor(){
        super();
        this.state = {
            name : "",
            username : "",
            password : "",
            employee_number : "",
            collage : ""
        }
    }


    changeName = (e) => {
        this.setState({
            name : e.target.value
        })
    }

    changeEmployee_number = (e) => {
        this.setState({
            employee_number : e.target.value
        })
    }

    changeEmail = (e) => {
        this.setState({
            username : e.target.value
        })
    }

    changePassword = (e) => {
        this.setState({
            password : e.target.value
        })
    }

    submitFormForFaculty = (e) => {
        e.preventDefault();
        if(this.state.collage !== "")
        {
        axios.post("http://localhost:5000/faculty/facultySignup",{
            name : this.state.name,
            username : this.state.username,
            password : this.state.password,
            employee_number : this.state.employee_number,
            collage : this.state.collage

        })
        .then(resfromserver => {
            if(resfromserver.data.message === "User is already present")
            {
                document.getElementById("answer").innerHTML = "User is already present";
            }
            else if(resfromserver.data.message === "User with that Username is present")
            {
                document.getElementById("answer").innerHTML = "User with that Username is present";
            }

            else if(resfromserver.data.message === "Username is not valid")
            {
                document.getElementById("answer").innerHTML = "Username is not valid";
            }
            else if(resfromserver.data.message === "password is incorrect")
            {
                document.getElementById("answer").innerHTML = "password is incorrect";
            }
            else if(resfromserver.data.message === "error")
            {
                document.getElementById("answer").innerHTML = "error in inserting";
            }
            else
            {
                this.props.history.push("/");
            }
            this.setState({
                name : "",
                username : "",
                password : "",
                employee_number : "",
                collage : ""
            })
        })
        .catch(error => {
            console.log(error.message);
        })
    }
    else
    {
        document.getElementById("answer").innerHTML = "Please choose a collage first.";
    }


    }

    setCollage = (name) =>{
        this.setState({
            collage : name
        })
    }
    render(){
        return(
            <React.Fragment>
                <form onSubmit = {this.submitFormForFaculty} >
                    <input type="text" value = {this.state.name} placeholder = "Enter your name" onChange = {this.changeName} required/><br/>
                    <input type = "text" value = {this.state.employee_number} placeholder ="Enter your employee number" onChange = {this.changeEmployee_number}  required /><br/>
                    <input type ="text" value={this.state.username} placeholder = "Enter your email address" onChange = {this.changeEmail} required/><br/>
                    <input type = "password" value={this.state.password} placeholder = "Enter your password"  onChange = {this.changePassword} required/><br/>
                    <InstituteList action={this.setCollage} />
                    <button type = "submit">Submit </button><br/>
                    <div id ="answer"></div>
                </form>
            </React.Fragment>
        )
    }
}

export default SignupFaculty;