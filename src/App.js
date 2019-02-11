import React, { Component } from 'react';
import Navigation from './components/Navigation';
import MessagePlate from './components/MessagePlate';
import InputText from './components/InputText';
import SignInScreen from './components/SignInScreen';
import RoomsScreen from './components/RoomsScreen';
import UsersScreen from './components/UsersScreen';
import io from "socket.io-client";
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      users: [],
      username: 'Guest',
      message: '',
      messages: [],
      route: 'signin',
      currentRoom: 'Global',
      rooms: []
    };
    this.socket = io('localhost:3001');
    //----SignInScreen---Start-------------------------
    this.socket.on('RECEIVE_USER', data => {
      addUser(data);
    });
    const addUser = data => {
      this.setState({
      	messages: data.initialRoom.messages,
      	users: data.initialRoom.users,
      	rooms: data.arrRoomsName
      });
    }
    //----SignInScreen---End---------------------------
    //----InputText---Start----------------------------
    this.socket.on('RECEIVE_MESSAGE', data => {
		//надо чекать, есть ли среди юзеров данной комнаты текущий юзер
		// плюс надо убирать пользователя на стороне сервера из предыдущей комнаты!
    	let roomUsers = data.roomUsrs.map(user=>user.username);
    	if (roomUsers.indexOf(this.state.username)>=0) {
      		addMessage(data); //принимаем массив с инфой о дате, авторе и тексте сообщений
    	}	
    });
    const addMessage = data => { 
        this.setState({
        	messages: data.roomMsgs,
        	users: data.roomUsrs
        });
    };
    //----InputText---End------------------------------
    //----RoomsScreen---Start--------------------------
    this.socket.on('COME_TO_ROOM', data => {
    	// if (data.userSkt === this.socket.id){
    	data.forEach(room => {
    		if (room.roomName === this.state.currentRoom){
    			switchRoom(room);
    		}
    	})
    })
    const switchRoom = data => {
    	this.setState({
    		currentRoom: data.roomName,
    		messages: data.messages,
    		users: data.users
    	});
    }
    //----RoomsScreen---End----------------------------
    this.socket.emit('disconnect', {userSocket: this.socket.id});
    this.socket.on('DISCONNECT_USER', data => {
    	data.forEach(room => {
    		if (room.roomName === this.state.currentRoom){
    			deleteUser(room.users);
    		}
    	})
    	
    });
    const deleteUser = data => {
    	this.setState({users: data});
    }
    
  } //end of constructor

  //---------SignInScreen---Start------------------
  onChangeUsername = (event) => {
    this.setState({username: event.target.value}) //записываем имя пользователя
  }

  onSendUser = (event) => {
    event.preventDefault();
    this.socket.emit('SEND_USER', { //отправляем имя пользователя и название комнаты на сервер
        username: this.state.username,
        currentRoom: this.state.currentRoom,
        userSocket: this.socket.id
    });
    this.setState({route: 'chat'}); //отображаем окно чата
  }
  //---------SignInScreen---End--------------------
  //---------InputText---Start---------------------
  onInputChange = (event) => {
    this.setState({
      message: event.target.value
    })
  }

  onSendMessage = () => {
    if (this.state.message.length>0) {
    	this.socket.emit('SEND_MESSAGE', {
	        username: this.state.username,
	        message: this.state.message,
	        hours: new Date().getHours(),
	        minutes: new Date().getMinutes(),
	        currentRoom: this.state.currentRoom
	    });
	    this.setState({
	  		message: ''
	  	});
    }
  }
  //---------InputText---End-----------------------
  //---------RoomsScreen---Start-------------------
  onGoToRoom = (roomName) => {
  	this.socket.emit('GO_TO_ROOM',{
  		nextRoom: roomName,
  		prevRoom: this.state.currentRoom,
  		userSocket: this.socket.id,
  		userName: this.state.username
  	});
  	this.setState({route: 'chat',currentRoom: roomName});
  }
  //---------RoomsScreen---End---------------------

  // onRouteChange = (data) => {
  //   this.setState({route: data})
  // }

  onUsersList = () => {this.setState({route: 'users'})} //!!!

  onBackToChat = () => {this.setState({route: 'chat'})} //!!!

  onRoomsList = () => {this.setState({route: 'rooms'})} //!!!
  
  render() {
    const {route} = this.state;
    let result;
    if (route === 'chat'){
      result = <div className="chat">
        <Navigation onRoomsList = {this.onRoomsList}
                    // onRouteChange = {this.onRouteChange}
                    currentRoom = {this.state.currentRoom}
                    onUsersList = {this.onUsersList}
                    // onVideoCall = {this.onVideoCall}
        />
        <MessagePlate arrayMessages = {this.state.messages}
                      currentUser = {this.state.username}
                      currentRoom = {this.state.currentRoom}
                      // videoStatus = {this.state.videoStatus}
        />
        <InputText  onInputChange = {this.onInputChange} // набор сообщения
                    onSendMessage = {this.onSendMessage} // отправка сообщения
                    eraseMessage = {this.state.message} //передаем пустую строку
        />  
      </div>
    } else if (route === 'signin'){
      result = <SignInScreen  onChangeUsername = {this.onChangeUsername}
                              onSendUser = {this.onSendUser}
      />;
    } else if (route === 'rooms'){
      result = <RoomsScreen onBackToChat = {this.onBackToChat}
      						roomList = {this.state.rooms}
      						onGoToRoom = {this.onGoToRoom}
      />;
    } else if (route === 'users'){
      result = <UsersScreen onBackToChat = {this.onBackToChat}
                            arrayUsers = {this.state.users}
      />;
    }
    return (
      <div className="App">
        {result}
      </div>
    );
  }
}

export default App;