import React from 'react';
import './components.css';

const SignInScreen = ({onChangeUsername, onSendUser}) => {
	return (
		<div className="SignInScreen">
			<label>Enter your nickname</label>
			<input placeholder='type here...' type="text" onChange = {onChangeUsername}/>
			<button type='submit' onClick = {onSendUser}>Go!</button>
		</div>
	)
}

export default SignInScreen;