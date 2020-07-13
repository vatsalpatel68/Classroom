import React , { Component } from 'react';
import { Link  } from 'react-router-dom';

class LoginSignup extends Component{
    render(){
        return(
            <React.Fragment>
            
                <Link to="/students/studentLogin"><h1>Student Login</h1></Link>
                <Link to="/students/studentSignup"><h1>Student SignUp</h1></Link>
                <Link to="/faculty/facultyLogin"><h1>Faculty Login</h1></Link>
                <Link to="/faculty/facultySignup"><h1>Faculty SignUp</h1></Link>
            
            </React.Fragment>
        )
    }
}

export default LoginSignup;