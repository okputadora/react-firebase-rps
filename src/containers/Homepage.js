import React, { Component } from 'react'

class Homepage extends Component{
  constructor(){
    super()
    this.username = ''
  }

  updateUsername(event){
    this.username = event.target.value
  }

  render(){
    return (
      <div className="container">
        <div className="row">
          <h2>pick a username </h2>
          <input onChange={this.updateUsername.bind(this)} className=" form-group form-control" type="text" />
          <button onClick={() => this.props.onLoad(this.username)} className="btn btn-primary">Look for a game</button>
        </div>
      </div>
    )
  }
}

export default Homepage
