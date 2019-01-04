import React from 'react';
import RoomList from './RoomList';
import RoomUsers from './RoomUsers';
import './components.css';
import imgVideo from './img/video-chat.png';

const Navigation = ({onRoomsList,onUsersList,currentRoom}) => {
	return (
		<nav className='nav'>
			<RoomList onRoomsList = {onRoomsList}/>
			<div className = "nameAndVideo">
				<div className='roomName'>{currentRoom}</div>
				<button className = 'btnVideo'><img src={imgVideo} alt="video-chat"/></button>
			</div>
			<RoomUsers onUsersList = {onUsersList}/>	
		</nav>
	);
}

export default Navigation;