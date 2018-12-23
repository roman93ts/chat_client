import React from 'react';
import './components.css';

const InputText = ({onInputChange, onSendMessage, eraseMessage}) => {
	return (
		<div className="sendMesForm">
			<textarea type='text' 
					placeholder='type message here' 
					className='inputMessage'
					onChange = {onInputChange}
					value = {eraseMessage}
			>
			</textarea>
			<button onClick = {onSendMessage}>Send</button>
		</div>
	);
}

export default InputText;