import React ,{Component} from 'react';
import "./faculty.css";
import { Link } from 'react-router-dom';
import axios from 'axios';

class facultyPanel extends Component{

    constructor(){
        
        super();
        this.state = {
            loading : false,
            message : ""
        }
    }

    componentWillMount(){
        axios.post("http://localhost:5000/faculty/verify",{
            id : this.props.match.params.id
        })
        .then(resFromDB =>
            {
               if(resFromDB.data === "notVerify")
               {
                   this.setState({
                       message : "you are not verify"
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
            {this.state.loading ? 
            <ul className = "adminlist">
                <Link to = {"/joiningrequest/" + this.props.match.params.id} refresh = {true}><h1><li className = "list-content">Joining Request</li></h1></Link>
                <Link to = {"/submissionReview/" + this.props.match.params.id}><h1><li className = "list-content">Submission Review</li></h1></Link>
                <Link to = {"/addProblem/" + this.props.match.params.id}><h1><li className = "list-content">add Problem</li></h1></Link>
                <Link to = {"/faculty/" + this.props.match.params.id + "/showAllProblem"}><h1><li className = "list-content">Show all problems</li></h1> </Link>           
            </ul>:<h1>{this.state.message}</h1>}
        </React.Fragment>
    )
    }
}



export default facultyPanel;
