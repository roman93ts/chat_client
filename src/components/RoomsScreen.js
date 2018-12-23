import React from 'react';

const RoomsScreen = ({onBackToChat, roomList, onGoToRoom}) => {
	return (
		<div className = "RoomsScreen">
			<h3 style={{margin: '0px'}}>Rooms List</h3>
			<div className="scrollRooms">
			{roomList.map((room, id) => {
				return (
					<button key={id} 
							style={{padding: '5px'}}
							onClick={()=>onGoToRoom(room)}
					>{room}</button>
				)
			})}
			</div>	
			<button onClick={onBackToChat}>Back</button>
		</div>
	)
}

export default RoomsScreen;