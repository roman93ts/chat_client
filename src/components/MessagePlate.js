import React, { Component } from 'react';
import './components.css';
import axios from 'axios';
import OpenViduSession from 'openvidu-react';
import imgVideo from './img/video-chat.png';

class MessagePlate extends Component {
	constructor(props){
		super(props);
		this.OPENVIDU_SERVER_URL = 'https://' + window.location.hostname + ':4443';
        this.OPENVIDU_SERVER_SECRET = 'MY_SECRET';
		this.state = {
			token: undefined,
			mySessionId: this.props.currentRoom,
			myUserName: this.props.currentUser,
			videoStatus: false
		};
		this.handlerJoinSessionEvent = this.handlerJoinSessionEvent.bind(this);
        this.handlerLeaveSessionEvent = this.handlerLeaveSessionEvent.bind(this);
        this.handlerErrorEvent = this.handlerErrorEvent.bind(this);
        this.joinSession = this.joinSession.bind(this);
	}

	handlerJoinSessionEvent() {
        console.log('Join session');
    }

    handlerLeaveSessionEvent() {
        console.log('Leave session');
        this.setState({
            session: undefined,
        });
    }

    handlerErrorEvent() {
        console.log('Leave session');
    }

    joinSession() {
        console.log('JOIN SESSSSSIOOOOOOON')
        if (this.state.mySessionId && this.state.myUserName) {
            this.getToken().then((token) => {
                this.setState({
                    token: token,
                    session: true,
                });
            });
        }
    }
    
    changeVideoStatus = () => {
    	if (this.state.videoStatus){
    		this.setState({videoStatus: false, session: false, token: undefined});
    	} else { 
    		this.setState({videoStatus: true});
    		this.joinSession();
    	}
    }


	render(){
		let className;let videoFrame;let btnClass;
		const {arrayMessages,currentUser} = {...this.props};
		const {mySessionId, myUserName, token,videoStatus} = {...this.state};
		if (videoStatus){
			btnClass = 'btnVideoOff';
			videoFrame = <OpenViduSession
                            id="opv-session"
                            sessionName={mySessionId}
                            user={myUserName}
                            token={token}
                            joinSession={this.handlerJoinSessionEvent}
                            leaveSession={this.handlerLeaveSessionEvent}
                            error={this.handlerErrorEvent}
                        /> 
		} else {btnClass = 'btnVideo';}
		return (
			<div className ='mainPlate'>
				<div className = 'videoPlate'>
					<div>
						{videoFrame}
					</div>	
					<button className = {btnClass} onClick = {this.changeVideoStatus}>
						<img src={imgVideo} alt="video-chat"/>
					</button>
				</div>
				<div className='msgPlate'>
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
			</div>
		);
	}

	getToken() {
        return this.createSession(this.state.mySessionId)
            .then((sessionId) => this.createToken(sessionId))
            .catch((Err) => console.error(Err));
    }

    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ customSessionId: sessionId });
            axios
                .post(this.OPENVIDU_SERVER_URL + '/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error.response && error.response.status === 409) {
                        resolve(sessionId);
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' + this.OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                    this.OPENVIDU_SERVER_URL +
                                    '"\n\nClick OK to navigate and accept it. ' +
                                    'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                    this.OPENVIDU_SERVER_URL +
                                    '"',
                            )
                        ) {
                            window.location.assign(this.OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
                });
        });
    }

    createToken(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ session: sessionId });
            axios
                .post(this.OPENVIDU_SERVER_URL + '/api/tokens', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });
    }
}

export default MessagePlate;