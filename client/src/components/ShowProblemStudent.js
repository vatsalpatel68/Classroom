import React , { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./student.css";

class ShowProblemStudent extends Component{
    componentWillMount(){
        axios.post("http://localhost:5000/students/getProblems",{
            id : this.props.match.params.id
        })
        .then(resFromBe => {
            this.setState({
                data : resFromBe.data.questions,
                loading : true
            })
        })
    }


    constructor(){
        super();
        this.state = {
            data : [],
            loading : false
        }
    }

    render(){
        let one_question = null;
        if(this.state.data.length > 0)
        {
            one_question = this.state.data.map(once => {
                return(
                <Link to = {`/student/ShowProblemStudent/${this.props.match.params.id}/` + once._id }><li key = {once._id}  className = "question_container"><div className = "question">Que :{once.question}</div><div className = "difficulty_box">{once.Difficulty}</div><div className = "faculty_name">Posted by : {once.facultydetail[0].name}</div></li></Link>
                )
            })
        }
        else{
             one_question = <h1>"No problem is left."</h1>;
        }
        return(
            <React.Fragment>
                {this.state.loading?
                <ul className = "question_list">
                {one_question}
                </ul>:<h1>{null}</h1>}
            </React.Fragment>
        )
    }
}


export default ShowProblemStudent;