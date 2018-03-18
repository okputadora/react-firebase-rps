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
      arena: [],
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
    // listen for arena changes
    firebase.database().ref("arena/").on("value", (snapshot) => {
      console.log("updating")
      const arena = snapshot.val()
      if (arena){
        if (arena.length === 2){
          this.evaluateWinner(arena)
        }
        this.setState({
          arena: arena,
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
    var attack = {name: this.props.username, weapon:event.target.id}
    if (this.state.arena.length > 0){
      var attackId = 1
    }
    else{var attackId = 0}
    firebase.database().ref("arena/"+attackId).set(attack)
  }

  evaluateWinner(arena){
    console.log("Evaluating winner")
    var winner;
    var weapon1 = arena[0].weapon
    var weapon2 = arena[1].weapon
    console.log(weapon1)
    console.log(weapon2)
    if (weapon1 === "rock"){
      if (weapon2 === "rock"){
        winner = "tie"
      }
      else if(weapon2 === "paper"){
        winner = arena[1].name
      }
      else{winner = arena[0].name}
    }
    else if(weapon1 === "paper"){
      if (weapon2 === "paper"){
        winner = "tie"
      }
      else if (weapon2 === "scissors"){
        winner = arena[1].name
      }
      else{winner = arena[0].name}
    }
    else{
      if (weapon2 === "scissors"){
        winner = "tie"
      }
      else if (weapon2 === "rock"){
        winner = arena[1].name
      }
      else{winner = arena[0].name}
    }
    // remove the arena to make way for the next round
    firebase.database().ref("arena/").set(null)
    this.setState({
      arena: [],
      instruction: "winner: " + winner
    })
  }

  render(){
    // map players to list of jsx elements
    if (this.state.activePlayers.length > 0){
      var activePlayers = this.state.activePlayers.map((player, i) => {
        return (<span key={i}> {player.name} </span>)
      })
    }
    else {var activePlayers = "there are no players in this game yet"}
    // map arena to list of jsx elements
    console.log("ARENA")
    console.log(this.state.arena)
    if (this.state.arena.length > 0){
      var attacks = this.state.arena.map((attack, i) => {
        return(
          <div key={i}>
            <div>{attack.name}: <span>{attack.weapon}</span></div>
          </div>
        )
      })
    }
    return (
      <div>
        <h2 className="border-bottom">Game</h2>
        <div className="card">
          <div className="card-header">
            {activePlayers}
          </div>
          <div className="card-body">
            {attacks}
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
