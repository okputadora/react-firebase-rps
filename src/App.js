import React, { Component } from 'react';
import Game from './containers/Game'
import Chat from './containers/Chat'

class App extends Component {
  render() {
    return (
    <div>
      <div className="jumbotron bg-dark text-light text-center">
        <h1>Rock, Paper, Scissors.</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <Game />
          </div>
          <div className="col-md-4">
            <Chat />
          </div>
        </div>
      </div>
    </div>
      );
  }
}

export default App;
