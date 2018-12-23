import React from 'react';
import imgRooms from './img/rooms.png';

const RoomList = ({onRoomsList}) => {
	return (
		<button className='btnRooms' onClick = {onRoomsList}><img src={imgRooms} alt='rooms'/></button>
	)
}

export default RoomList;