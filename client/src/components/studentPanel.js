import React ,{Component} from 'react';
import "./faculty.css";
import { Link } from 'react-router-dom';
import axios from "axios";

class studentPanel extends Component{

    constructor(){
        super();
        this.state = {
            loading : false,
            message : ""
    }
}
    componentWillMount(){
        axios.post("http://localhost:5000/students/verify",{
            id : this.props.match.params.id
        })
        .then(resFromBe => {
            if(resFromBe.data === "notVerify")
            {
                this.setState({
                    message : "You are not verify,Ask your mentor to verify"
                })
            }
            else
            {
                this.setState({
                    loading : true
                })
            }

        })
    }
    render(){
        
    return(
        <React.Fragment>
            {this.state.loading?
            <ul className = "adminlist">
                <Link to = {"/student/ShowProblemsStudent/" + this.props.match.params.id }><li className = "list-content">Show Problems</li></Link>
                <Link  to = {"/student/SubmittedStudent/" + this.props.match.params.id } ><li className = "list-content">My Submission</li></Link>
                </ul>:
                <h1>{this.state.message}</h1>}
        </React.Fragment>
    )
    }
}



export default studentPanel;