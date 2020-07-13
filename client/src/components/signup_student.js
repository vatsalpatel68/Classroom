import React, { Component } from 'react';
import axios from 'axios';
import InstituteList from './InstituteList';

class SignupStudent extends Component{


    constructor(){
        super();
        this.state = {
            name : "",
            username : "",
            password : "",
            enrollment_no : "",
            collage : ""

        }
    }

    changeEnrollment_no = (e) =>
    {
        this.setState({
            enrollment_no : e.target.value
        })
    }

    changeName = (e) =>
    {
        this.setState({
            name : e.target.value
        })
    }



    changePassword = (e) =>
    {
        this.setState({
            password : e.target.value
        })
    }

    changeUsername = (e) => {
        this.setState({
            username : e.target.value
        })
    }
   

    submitForm = (e) =>{
        e.preventDefault();
        if(this.state.collage !== ""){
        
        axios.post("http://localhost:5000/students/studentsignup",
        {
        
            name : this.state.name,
            username : this.state.username,
            password : this.state.password,
            enrollment_no : this.state.enrollment_no,
            collage : this.state.collage
            
           
        })
        .then(res => {
            if(res.data === "email is not valid")
            {
                document.getElementById("answer").innerHTML = "Please enter a Valid email address.";
            }
            else if(res.data === "password is not valid"){
                document.getElementById("answer").innerHTML = "Your password should 8 Character Long.";
            }
            else if(res.data.message === "User is present")
            {
                document.getElementById("answer").innerHTML = "User is already present.";
            }
            else if(res.data.message === "User with this Username is present")
            {
                document.getElementById("answer").innerHTML = "User with this Username is present";
            }
            else
            {               
                 this.props.history.push("/");
            }
            this.setState({
                name : "",
                username : "",
                password : "",
                enrollment_no : "",
                collage : ""
            })
        });
    }
    else
    {
        document.getElementById("answer").innerHTML = "Please Choose a Collage first";
    }
    }
 


    setCollage =(name) => {
        this.setState({
            collage : name
        })
        
    }

    render(){
        return(
            <React.Fragment>
                <form onSubmit = {this.submitForm} autoComplete = "off">
                    <input type="text" name="name" onChange = {this.changeName} value = {this.state.name} placeholder="Enter your Name" required/><br/>
                    <input type="number" name="enrollment_no" onChange = {this.changeEnrollment_no} value = {this.state.enrollment_no} placeholder = "Enter your enrollment no." required /><br/>
                    <input type="text" name="username" onChange = {this.changeUsername} value = {this.state.username} placeholder="Enter your Email"  required/><br/>
                    <input type="password" name="password"  onChange = {this.changePassword} value = {this.state.password} placeholder="Enter your password" required/><br/>   
                    <InstituteList action={this.setCollage} />     
                    <button type="submit">Submit</button>
                    <div id = "answer"></div>
                </form>             
            </React.Fragment>
        )
    }
}

export default SignupStudent;