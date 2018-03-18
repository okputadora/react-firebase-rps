import React, { Component } from 'react';
import Game from './Game'
import Chat from './Chat'
class Board extends Component{
  render(){
    console.log(this.props.username)
    return(
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <Game />
          </div>
          <div className="col-md-4">
            <Chat username={this.props.username}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Board
