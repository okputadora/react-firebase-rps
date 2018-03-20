import React, { Component } from 'react';
import firebase from 'firebase'
import styles from './style'
const chatStyle = styles.chat
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
      // every time the chat loads a new message we want to scroll to the
      // bottom so the most recent messages are visible
      setTimeout(() => this.updateScroll(), 0) // interval = 0 !?!?!?
      // whats going on here??? I'm glad you asked...it's quite interesting
      // if we were to call this function outside of an interval it would
      // run before the DOM changes. We want it to scroll to the bottom AFTER
      // the DOM changes. By calling setInterval we're removing it from the
      // call stack until the call stack until all of the other operations
      // have been performed (in this case re-rendering the dom)
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
    // add the message to the databse and set its id to length of the messages
    // ...we don't need to update state
    // because our firebase function in componentDidMount is listening to
    // changes in the databse and it updates the state as part of its callback
    firebase.database().ref('messages/'+nextMessage.id).set(nextMessage)
  }

  // keep the chat window scrolled to the bottom so we're always seeing
  // the newest message
  updateScroll(){
    console.log("updating scroll")
    let element = document.getElementById("chatList");
    element.scrollTop = element.scrollHeight;
  }
  render(){
    // map this list elements of state to jsx elements
    var currentMessages = this.state.messages.map((message) =>{
      return (<li className="list-group-item" key={message.id}>{message.text}</li>)
    })

    return(
      <div>
        <h2 className="border-bottom">Chat</h2>
        <div className="list-group d-flex flex-column justify-content-end rounded" style={chatStyle.container}>
          <ul id="chatList" style={chatStyle.list}>
            {currentMessages}
          </ul>
          <form className="form-inline list-group-item">
            <input onChange={this.updateMessage.bind(this)} className="form-control" type="text" placeholder="Message..."/>
            <button onClick={this.submitMessage.bind(this)} id="submit" type="button" className="btn btn-secondary">send</button>
          </form>
        </div>
        <span className="font-weight-bold">username: </span><span>{this.props.username}</span>
      </div>
    )
  }
}

export default Chat
