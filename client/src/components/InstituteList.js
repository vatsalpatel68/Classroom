import React, { Component } from 'react';
import axios from 'axios';


class InstituteList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data : []
        };
      }
    
      componentDidMount() {
            axios.get("http://localhost:5000/students/instituteList")
            .then(res => {
                this.setState({
                    data : res.data
                })
            })
           
      }


      changeCollage = (e) => {
          this.props.action(e.target.value);
      }

      render(){
          

        if(this.state.data.length > 0)
        {
           var data = this.state.data.map(once => {
                return(
                <option key={once.index} value={once.name}>{once.name}</option>
                )   
            })

        }

    
    

        return (
          <React.Fragment>
              <h4 className="Notice">If your collage is not registered then you cannot find your collage.</h4>
              <select onChange = {this.changeCollage}>
                  <option defaultChecked value="">Please enter a Collage:</option>
                {data}
              </select>
              <br/>
          </React.Fragment>
        );
      }

}

export default InstituteList;