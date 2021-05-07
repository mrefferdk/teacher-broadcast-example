import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { Grid, List, Segment, Dropdown } from '@clio/sui'
import logo from '@clio/branding/src/logo/vector/clio-logo_black_32.svg';


// Create socket connection
const socket = io('localhost:8000/hogwarts');


const Inbox = function(props) {
	return (
		<List divided>
			{props.messages.map((item, index) => {
				return (
					<List.Item key={index}>

						<List.Content>
							<List.Header>{item.title}</List.Header>
							<div className="messageBody">
								{item.body}
							</div>
							<List.Description>
								{item.time}
							</List.Description>
						</List.Content>
					</List.Item>
				);
			})}
		</List>
	);
};


const ClientApp = function() {
    const [groups, setGroups]                 = useState([]);
    const [students, setStudents]             = useState([]);
    const [messages, setMessages]             = useState([]);
    const [currentGroup, setCurrentGroup]     = useState(null);
    const [currentStudent, setCurrentStudent] = useState(null);

    // Get initial data
    useEffect(() => {
        fetch('/data/students')
            .then(res => res.json())
            .then(students => setStudents(students));

        fetch('/data/groups')
            .then(res => res.json())
            .then(groups => setGroups(groups));
    }, []);

    // Handle messages
    useEffect(() => {
        // Listen for messages
        socket.on('message', message => setMessages([...messages, message]));

        // Stop listening
        return () => socket.removeAllListeners('message');
    }, [messages]);

    // Set/change student room
    const changeStudent = (e, data) => {
        socket.emit('leave', currentStudent);
        setCurrentStudent(data.value);
        socket.emit('join', data.value);
    };

    // Set/change group room
    const changeRoom = (e, data) => {
        socket.emit('leave', currentGroup);
        setCurrentGroup(data.value);
        socket.emit('join', data.value);
    };

	return (
		<Grid columns='equal'>
			<Grid.Column></Grid.Column>
			<Grid.Column width={6}>
				<Segment>
					<img id={'clio-logo'} src={logo} /><h1>Messages inbox</h1>
					<Dropdown fluid
                              search
                              selection
                              options={students} placeholder={'Who are you?'}
                              onChange={changeStudent} />
                    <br/>
					<Dropdown fluid
                              search
                              selection
                              options={groups} placeholder={'Choose group'}
                              onChange={changeRoom} />
                    <Inbox messages={messages}/>
				</Segment>
			</Grid.Column>
			<Grid.Column></Grid.Column>
		</Grid>
	);
};

ReactDOM.render(<ClientApp/>, document.getElementById('teacher-broadcast-client-student-container'));


