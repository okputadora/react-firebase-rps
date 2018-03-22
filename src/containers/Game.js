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
      wins: 0,
      opponentWins: 0,
      instruction: <button onClick={this.joinGame.bind(this)} className="btn btn-secondary">Join this Game</button>
    }
    this.currentPlayer = {name: username},
    this.opponent = ''
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
        // save the opponents name
        if (activePlayers.length === 2){
          activePlayers.forEach((player) => {
            if (player.name !== this.props.username){
              this.opponent = player.name
            }
          })
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
      const arena = snapshot.val()
      if (arena){
        this.setState({
          arena: arena
        })
        if (arena.length === 2){
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
    // send the attack (rock, paper, scissors) to the board node in firebase
    var attack = {name: this.props.username, weapon:event.target.id}
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
        winner = arena[1].name
      }
      else{winner = arena[0].name}
    }
    else if(weapon1 === "paper"){
      if (weapon2 === "paper"){
        winner = tie
      }
      else if (weapon2 === "scissors"){
        winner = arena[1].name
      }
      else{winner = arena[0].name}
    }
    else{
      if (weapon2 === "scissors"){
        winner = tie
      }
      else if (weapon2 === "rock"){
        winner = arena[1].name
      }
      else{winner = arena[0].name}
    }
    // log win or loss for this user
    if (winner === this.props.username){
      // note: we don't need to make a copy of this value because it is a
      // primative type (i.e. not a reference type) so changing its value
      // does not change the orignal value from which it was copied
      let currentWins = this.state.wins
      currentWins++
      this.setState({
        wins: currentWins
      })
    }
    else if (winner !== tie){
      console.log("OPP WON")
      let opponentWins = this.state.opponentWins
      opponentWins++
      this.setState({
        opponentWins: opponentWins
      })
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
        instruction: <div><p>{win + winner}</p><p>select another attack to play again"</p></div>
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
      if (this.state.activePlayers.length === 2){
        var scoreboard = <div className="">
          {this.props.username}: {this.state.wins}
          {this.opponent}: {this.state.opponentWins}
        </div>
      }
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
            {scoreboard}
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
