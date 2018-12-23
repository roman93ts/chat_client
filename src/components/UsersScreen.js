import React from 'react';

const UsersScreen = ({onBackToChat, arrayUsers}) => {
	return (
		<div className = "UsersScreen">
			<h3 style={{margin: '0px'}}>Users in this Room</h3>
			<div className="scrollUsers">
				{arrayUsers.map((user,id) => {
					return (
						<div key = {id} style={{padding: '5px'}}>{user.username}</div>
					)
				})}
			</div>	
			<button onClick = {onBackToChat}>Back</button>
			{/*()=>{ f1(); f2() }*/}
		</div>
	)
}

export default UsersScreen;