import React, { Component } from 'react';
import firebase from 'firebase'

// Initialize Firebase
const firebaseInit = () => {
  let config = {
    apiKey: "AIzaSyCeaE6SXQq7-T5c7f1trAJEB7hv_mowjbs",
    authDomain: "react-rps.firebaseapp.com",
    databaseURL: "https://react-rps.firebaseio.com",
    projectId: "react-rps",
    storageBucket: "react-rps.appspot.com",
    messagingSenderId: "675830051613"
  };
  firebase.initializeApp(config);
}

class Chat extends Component {
  constructor(){
    super();
    firebaseInit();
    // this.updateMessage = this.updateMessage.bind(this)
    this.state = {
      message: {id: '', text: ''},
      messages: []
    }
  }

  componentDidMount(){
    // pull data from firebase
    firebase.database().ref("messages/").on('value', (snapshot) => {
      const currentMessages = snapshot.val()
      if (currentMessages){
        this.setState({
          messages: currentMessages
        })
      }
    })
  }

  updateMessage(event){
    // capture user activity in input field and set the state
    let message = this.props.username + ": " + event.target.value
    this.setState({
      message: message
    })
  }

  submitMessage(event){
    var nextMessage = {
      id: this.state.messages.length,
      text: this.state.message
    }
    // add the message to the databse....we don't need to update state
    // because our firebase function in componentDidMount is listening to
    // changes in the databse and it updates the state as part of its callback
    firebase.database().ref('messages/'+nextMessage.id).set(nextMessage)
  }
  render(){
    // map this list elements of state to jsx elements
    var currentMessages = this.state.messages.map((message) =>{
      return (<li className="list-group-item" key={message.id}>{message.text}</li>)
    })

    return(
      <div>
        <h2 className="border-bottom">Chat</h2>
        <ul className="list-group">
          {currentMessages}
        </ul>
        <span className="font-weight-bold">username: </span><span>{this.props.username}</span>
        <input onChange={this.updateMessage.bind(this)} className="form-group form-control" type="text" placeholder="Message..."/><br />
        <button onClick={this.submitMessage.bind(this)} id="submit" type="button" className="btn btn-secondary">send</button>
      </div>
    )
  }
}

export default Chat
