import React, { Component } from 'react';
import Board from './containers/Board'
import Homepage from './containers/Homepage'

class App extends Component {
  constructor(){
    super()
    this.state = {
      currentWindow: <Homepage onLoad={(username) => this.loadBoard(username)}/>
    }
  }

  loadBoard(username){
    this.setState({
      currentWindow: <Board username={username}/>
    })
  }

  render() {
    return (
    <div>
      <div className="jumbotron bg-dark text-light text-center">
        <h1>Rock, Paper, Scissors.</h1>
      </div>
      {this.state.currentWindow}
    </div>
      );
  }
}

export default App;
