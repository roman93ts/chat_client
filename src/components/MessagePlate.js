import React from 'react';
import './components.css';

const MessagePlate = ({arrayMessages, currentUser}) => {
	let className;
	return (
		<div className='plate'>
			{arrayMessages.map((mes,id) => {
				if (currentUser === mes.username){
					className = "rightFloat";
				} else className = "";
				return(
					<div key={id} className={className}>
						<div className="authorName">{mes.username} {mes.hours}:{mes.minutes}</div> 
						<div className="messageCloud">{mes.message}</div>
					</div>
				);
			})}
		</div>
	);
}

export default MessagePlate;