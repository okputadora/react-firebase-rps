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
      message: '',
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

      // add an event-listener to the chat input so we can send on enter
      // var message = document.getElementById("message")

    })
  }

  updateMessage(event){
    // capture user activity in input field and set the state
    let message =  event.target.value
    this.setState({
      message: message
    })
  }

  submitMessage(){
    var nextMessage = {
      id: this.state.messages.length,
      text: this.state.message,
      username: this.props.username
    }
    // add the message to the databse and set its id to length of the messages
    // ...we don't need to update state
    // because our firebase function in componentDidMount is listening to
    // changes in the databse and it updates the state as part of its callback
    firebase.database().ref('messages/'+nextMessage.id).set(nextMessage)
  }
  // submit the message when the user hits enter too
  // you may be wondering why
  enterMessage(event){
    if (event.key === "Enter"){
      this.submitMessage()
    }
  }

  // keep the chat window scrolled to the bottom so we're always seeing
  // the newest message
  updateScroll(){
    let element = document.getElementById("chatList");
    element.scrollTop = element.scrollHeight;
  }
  render(){
    // map this list elements of state to jsx elements
    var currentMessages = this.state.messages.map((message) =>{
      // style the messages differently if they're the users vs. the opponent
      if (message.username === this.props.username){
        return (<div className="clearfix"><li style={chatStyle.messageOut} key={message.id}>{message.text}</li></div>)
          }
          else{
            return (<div className="clearfix"><li style={chatStyle.messageIn} key={message.id}>
              <span className="font-weight-bold">{message.username}: </span>{message.text}</li></div>)
      }
    })

    return(
      <div>
        <h2 className="border-bottom">Chat</h2>
        <div className="list-group d-flex flex-column justify-content-end rounded" style={chatStyle.container}>
          <ul id="chatList" style={chatStyle.list}>
            {currentMessages}
          </ul>
          <div className="form-inline list-group-item">
            <input onChange={this.updateMessage.bind(this)} onKeyPress={this.enterMessage.bind(this)} id="message" className="form-control" style={{width: "100%"}} type="text" placeholder="Message..."/>
          </div>
          <button onClick={this.submitMessage.bind(this)} id="submit" type="button" className="btn btn-secondary">send</button>
        </div>
        <span className="font-weight-bold">username: </span><span>{this.props.username}</span>
      </div>
    )
  }
}

export default Chat
