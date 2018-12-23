import React from 'react';
import imgUsers from './img/users.png';

const RoomUsers = ({onUsersList}) => {
	return (
		<button className='btnUsers' onClick = {onUsersList}><img src={imgUsers} alt='users'/></button>
	)
}

export default RoomUsers;