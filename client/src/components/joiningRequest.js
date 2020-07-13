import React , { Component } from 'react';
import axios from 'axios';
import JoiningRequestHeader from "./joiningRequestHeader";

class JoiningRequest extends Component{

    constructor(){
        super();
        this.state = {
            data : [],
            count : 0
        }
    }
    componentDidMount(){
        axios.post("http://localhost:5000/faculty/joiningRequest" , {
            id : this.props.match.params.id
        })
        .then(resFromDb => { 
            console.log(resFromDb);
            this.setState({
                data : resFromDb.data.data,
                count : resFromDb.data.data.length
            })
        })

    }

    componentDidUpdate(prevProps,prevState){
        if(prevState.count !== this.state.count){
            axios.post("http://localhost:5000/faculty/joiningRequest" , {
                id : this.props.match.params.id
            })
            .then(resFromDb => { 
                this.setState({
                    data : resFromDb.data.data,
                    count : resFromDb.data.data.length
                })
            })
        }
    }

    acceptUser = (e) =>{
        axios.post("http://localhost:5000/faculty/approveReject", {
            id : e.target.value,
            type : e.target.name,
            process : "approve"
        })
        .then(resFromBE => {

            this.setState({
                count : this.count - 1
            })
        })
    }

    rejectUser = (e) =>{
        axios.post("http://localhost:5000/faculty/approveReject" , {
            id : e.target.value,
            type : e.target.name,
            process : "reject"
        })
        .then(resFromBE => {
            this.setState({
                count : this.count - 1
            })
        })
    }

    render(){
        if(this.state.data.length > 0)
        {
            var a = this.state.data.map(once => {
               return(
                   <tr key = {once._id}>
                       <td>{once.type}</td>
                       <td>{once._id}</td>
                       <td>{once.name}</td>
                       <td>{once.username}</td>
                       <td><button value = {once._id} name = {once.type} onClick = {this.acceptUser}>Accept</button></td>
                       <td><button value = {once._id} name = {once.type} onClick = {this.rejectUser}>Reject</button></td>
                    </tr>  
        
               )
            })
        }
        return(
            <React.Fragment>
                <table>
                    {this.state.count > 0 ? <JoiningRequestHeader />:<h1>No Pending request is present</h1>}
                <tbody>
                    {a}
                </tbody>
                </table>
            </React.Fragment>
        )
    }
}


export default JoiningRequest;
