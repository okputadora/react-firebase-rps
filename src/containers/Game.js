import React, { Component } from 'react';
import firebase from 'firebase'

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
    // this will be used to check whether they;ve joined the game yet
    // they cant start attacking untill they've joined the game
    this.joined = false;
    // also, don't let them attack if they're currently waiting on
    // the opponents attack
    this.waiting = false;

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
        if (activePlayers.length === 2){
          this.setState({
            instruction: "choose an attack. when both players have thrown their attack the winner will be revealed."
          })
        }
      }
    })
    // listen for arena changes
    firebase.database().ref("arena/").on("value", (snapshot) => {
      console.log("updating arena")
      const arena = snapshot.val()
      console.log(arena)
      if (arena){
        this.setState({
          arena: arena
        })
        if (arena.length === 2){
          console.log("arena length === 2")
          this.evaluateWinner(arena)
        }
      }
      else{
        this.setState({
          arena: []
        })
      }
    })
  }

  joinGame(){
    this.joined = true
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
    // only let the user shoot if they've joined the game and aren't waiting
    // for their opponents attack
    if (!this.joined || this.waiting){
      return
    }
    console.log("SHoot!")
    // send the attack (rock, paper, scissors) to the board node in firebase
    var attack = {name: this.props.username, weapon:event.target.id}
    console.log("state arena: "+JSON.stringify(this.state.arena))
    if (this.state.arena.length > 0){
      var attackId = 1;
    }
    else{attackId = 0}
    this.setState({
      instruction: ""
    })
    this.waiting = true
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
    // allow the player to attack again
    this.waiting = false
    // remove the arena to make way for the next round
    // note: removing doesn't really remove thise node it sets it to NULL
    // so the arena listener needs to look for null values and remove them before
    // seeing if it's time to evalutate a winner
    setTimeout(() => {
      firebase.database().ref("arena/").remove()
      this.setState({
        arena: [],
        instruction: "winner: " + winner + ". select another attack to play again"
      })
    }, 2000)
  }

  render(){
    // map players to list of jsx elements
    if (this.state.activePlayers.length > 0){
      var activePlayers = this.state.activePlayers.map((player, i) => {
        return (<span key={i}> {player.name} </span>)
      })
    }
    else {activePlayers = "there are no players in this game yet"}
    // map arena to list of jsx elements
    if (this.state.arena.length > 0){
      var attacks = this.state.arena.map((attack, i) => {
        // only display the users attack - hide the opponents attack
        // unless they've both attacked then display both
        if (attack.name === this.props.username || this.state.arena.length === 2){
          return(
            <div key={i}>
              <div>{attack.name}: <span>{attack.weapon}</span></div>
            </div>
          )
        }
        else{
          return(
            <div key={i}>
              <div>{attack.name}: <span>#########</span></div>
            </div>
          )
        }
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
