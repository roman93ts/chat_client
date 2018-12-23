import React from 'react';
import RoomList from './RoomList';
import RoomUsers from './RoomUsers';
import './components.css';

const Navigation = ({onRoomsList,onUsersList,currentRoom}) => {
	return (
		<nav className='nav'>
			<RoomList onRoomsList = {onRoomsList}/>
			<div className='roomName'>{currentRoom}</div>
			<RoomUsers onUsersList = {onUsersList}/>	
		</nav>
	);
}

export default Navigation;