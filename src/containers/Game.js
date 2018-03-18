import React, { Component } from 'react';
import firebase from 'firebase'

// Initialize Firebase
// const firebaseInit = () => {
//   let config = {
//     apiKey: "AIzaSyCeaE6SXQq7-T5c7f1trAJEB7hv_mowjbs",
//     authDomain: "react-rps.firebaseapp.com",
//     databaseURL: "https://react-rps.firebaseio.com",
//     projectId: "react-rps",
//     storageBucket: "react-rps.appspot.com",
//     messagingSenderId: "675830051613"
//   };
//   firebase.initializeApp(config);
// }
class Game extends Component {
  constructor(props){
    super(props)
    const username = this.props.username
    this.state = {
      currentPlayer: {name: username},
      activePlayers: [],
      instruction: <button onClick={this.joinGame.bind(this)} className="btn btn-secondary">Join this Game</button>
    }

  }
  componentDidMount(){
    // see if there are any players waiting for a game
    // starting by limiting players to 2 -- eventually I'll need to
    // create games for every two active players and move their chat,
    // usernames into that object
    firebase.database().ref("players/").on("value", (snapshot) => {
      console.log("updating")
      const activePlayers = snapshot.val()
      if (activePlayers){
        console.log(activePlayers)
        this.setState({
          activePlayers: activePlayers,
        })
      }
    })

  }

  joinGame(){
    console.log("Joined")
    var id = this.state.activePlayers.length
    if (id === 1){
      var instruction = <p>choose an attack. when both players have thrown their attack the winner will be revealed</p>
      firebase.database().ref("players/"+id).set(this.state.currentPlayer)
    }
    else if (id === 0){
      firebase.database().ref("players/"+id).set(this.state.currentPlayer)
      instruction = <p>waiting for one other player...</p>
    }
    else{instruction = <p>there are already two players playing. try back in a bit.</p>}
    this.setState({
      instruction: instruction
    })
  }

  shoot(event){
    console.log("SHoot!")
    // send the attack (rock, paper, scissors) to the board
    firebase.database().ref("arena/"+this.props.username).set(event.target.id)
  }
  render(){
    if (this.state.activePlayers.length > 0){
      var activePlayers = this.state.activePlayers.map((player, i) => {
        return (<span key={i}> {player.name} </span>)
      })
    }
    else{var activePlayers = "there are no players in this game yet"}
    return (
      <div>
        <h2 className="border-bottom">Game</h2>
        <div className="card">
          <div className="card-header">
            {activePlayers}
          </div>
          <div className="card-body">
            {this.state.instruction}
          </div>
        </div>
        <div className="btn-group" role="group">
          <button onClick={this.shoot.bind(this)} id="rock" type="button" className="btn btn-secondary">Rock</button>
          <button onClick={this.shoot.bind(this)} id="paper" type="button" className="btn btn-secondary">Paper</button>
          <button onClick={this.shoot.bind(this)} id="scissors" type="button" className="btn btn-secondary">Scissors</button>
        </div>
      </div>
    )
  }
}

export default Game
