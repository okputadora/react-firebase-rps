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
    console.log("mounted")
    // pull data from firebase
    firebase.database().ref("messages/").on('value', (snapshot) => {
      console.log("database has changed")
      console.log(snapshot.val())
      const currentMessages = snapshot.val()
      console.log(currentMessages)
        this.setState({
          messages: currentMessages
      })
    })
  }

  updateMessage(event){
    // capture user activity in input field
    this.setState({
      message: event.target.value
    })
  }

  submitMessage(event){
    var nextMessage = {
      id: this.state.messages.length,
      text: this.state.message
    }
    // var updatedMessages = Object.assign([], this.state.messages)
    // updatedMessages.push(nextMessage)
    // this.setState({
    //   message: "",
    //   messages: updatedMessages
    // })
    firebase.database().ref('messages/'+nextMessage.id).set(nextMessage)
  }
  render(){
    var currentMessages = this.state.messages.map((message) =>{
      return (<li key={message.id}>{message.text}</li>)
    })

    return(
      <div>
        <h2 className="border-bottom">Chat</h2>
        <ol className="border border-primary">
          {currentMessages}
        </ol>
        <input onChange={this.updateMessage.bind(this)} className="form-group form-control" type="text" placeholder="Message..."/><br />
        <button onClick={this.submitMessage.bind(this)} id="submit" type="button" className="btn btn-secondary">send</button>
      </div>
    )
  }
}

export default Chat
