import React, { Component } from 'react';

class Game extends Component {
  render(){
    return (
      <div>
        <h2 className="border-bottom">Game</h2>
        <div className="btn-group" role="group">
          <button id="rock" type="button" className="btn btn-secondary">Rock</button>
          <button id="paper" type="button" className="btn btn-secondary">Paper</button>
          <button id="scissors" type="button" className="btn btn-secondary">Scissors</button>
        </div><br />
        <button id="submit" type="button" className="btn btn-secondary">Shoot</button>
      </div>
    )
  }
}

export default Game
