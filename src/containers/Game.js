import React, { Component } from 'react';
import firebase from 'firebase'
import style from './style'
const gameStyle = style.game

class Game extends Component {
  constructor(props){
    super(props)
    const username = this.props.username
    this.state = {
      activePlayers: [],
      arena: [],
      instruction: <button onClick={this.joinGame.bind(this)} className="btn btn-secondary">Join this Game</button>
    }
    this.currentPlayer = {name: username},
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
            instruction: <div>
              <p>Choose an attack.</p>
              <p>When both players have thrown their attack the winner will be revealed</p>
            </div>
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

      // listen for disconnect and clear everything out of the database
      // after this happens -- NOTE this doesn't create a listenable change
      firebase.database().ref().onDisconnect().set("disconnected")
    })
  }

  joinGame(){
    this.joined = true
    var id = this.state.activePlayers.length
    if (id === 1){
      var instruction = <div>
        <p>Choose an attack.</p>
        <p>When both players have thrown their attack the winner will be revealed</p>
      </div>
      firebase.database().ref("players/"+id).set(this.currentPlayer)
    }
    else if (id === 0){
      firebase.database().ref("players/"+id).set(this.currentPlayer)
      instruction = <p>Waiting for one other player...</p>
    }
    // should eventually allow for multiple games
    else{instruction = <p>There are already two players playing. Try back in a bit.</p>}
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
    var winner;
    var weapon1 = arena[0].weapon
    var weapon2 = arena[1].weapon
    var tie = 'It was a tie'
    var win = 'Winner: '
    if (weapon1 === "rock"){
      if (weapon2 === "rock"){
        winner = tie
      }
      else if(weapon2 === "paper"){
        winner = win + arena[1].name
      }
      else{winner = win + arena[0].name}
    }
    else if(weapon1 === "paper"){
      if (weapon2 === "paper"){
        winner = tie
      }
      else if (weapon2 === "scissors"){
        winner = win + arena[1].name
      }
      else{winner = win + arena[0].name}
    }
    else{
      if (weapon2 === "scissors"){
        winner = tie
      }
      else if (weapon2 === "rock"){
        winner = win + arena[1].name
      }
      else{winner = win + arena[0].name}
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
        instruction: <div><p>{winner}</p><p>select another attack to play again"</p></div>
      })
    }, 2000)
  }

  render(){
    // map players to list of jsx elements
    if (this.state.activePlayers.length > 0){
      var activePlayers = this.state.activePlayers.map((player, i) => {
        if (i === 0){
          var vs = "vs."
        }
        return (<span key={i}> {player.name} {vs}</span>)
      })
    }
    else {activePlayers = "There are no players in this game yet"}
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
        <div className="card rounded" style={gameStyle.container}>
          <div className="card-header">
            {activePlayers}
          </div>
          <div className="card-body">
            {attacks}
            {this.state.instruction}
          </div>
        </div>
        <div className="btn-group" style={gameStyle.weapons}role="group">
          <button onClick={this.shoot.bind(this)} id="rock" type="button" className="btn btn-secondary">Rock</button>
          <button onClick={this.shoot.bind(this)} id="paper" type="button" className="btn btn-secondary">Paper</button>
          <button onClick={this.shoot.bind(this)} id="scissors" type="button" className="btn btn-secondary">Scissors</button>
        </div>
      </div>
    )
  }
}

export default Game
