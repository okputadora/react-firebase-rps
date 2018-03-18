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
      activePlayers: []
    }

  }
  componentDidMount(){
    // see if there are any players waiting for a game
    // starting by limiting players to 2 -- eventually I'll need to
    // create games for every two active players and move their chat,
    // usernames into that object
    firebase.database().ref("players/").on("value", (snapshot) => {
      console.log("updating")
      const currentPlayers = snapshot.val()
      if (currentPlayers){
        console.log(currentPlayers)
        this.setState({
          activePlayers: currentPlayers
        })
      }
    })

  }

  joinGame(){
    console.log("Joined")
    var id = this.state.activePlayers.length
    firebase.database().ref("players/"+id).set(this.state.currentPlayer)
  }
  render(){
    if (this.state.activePlayers.length > 0){
      var activePlayers = this.state.activePlayers.map((player) => {
        return (<span> {player.name} </span>)
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
            <button onClick={this.joinGame.bind(this)}className="btn btn-secondary">Join this Game</button>
          </div>
        </div>
        <div className="btn-group" role="group">
          <button id="rock" type="button" className="btn btn-secondary">Rock</button>
          <button id="paper" type="button" className="btn btn-secondary">Paper</button>
          <button id="scissors" type="button" className="btn btn-secondary">Scissors</button>
        </div>
      </div>
    )
  }
}

export default Game
