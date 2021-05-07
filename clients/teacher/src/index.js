import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Menu, Dropdown, Form, Button, Input, Grid } from '@clio/sui'
import logo from '@clio/branding/src/logo/vector/clio-logo_black_32.svg';
import io from 'socket.io-client';

// Create socket connection
const socket = io('localhost:8000/hogwarts');

const MessageForm = function(props) {
    const [groups, setGroups]       = useState([]);
    const [students, setStudents]   = useState([]);
	const [message, setMessage]     = useState(null);
	const [receivers, setReceivers] = useState([]);

    // Get initial data
    useEffect(() => {
        fetch('/data/students')
            .then(res => res.json())
            .then(students => setStudents(students));

        fetch('/data/groups')
            .then(res => res.json())
            .then(groups => setGroups(groups));
    }, []);


	let onSubmit = function() {
		console.log('SUBMIT', {
			message: message,
			receivers: receivers,
		});

		socket.emit('broadcast', {
			rooms: receivers,
			message: {
				title: 'Message from teacher',
				body: message,
				time: (new Date()).toLocaleString()
			}
		});

	};

	return (
	<Form onSubmit={() => onSubmit()}>
		<Form.Field>
			<label>Message</label>
			<Input onChange={(e, data) => { setMessage(data.value)}} placeholder='Write your message here...' />
		</Form.Field>
		<Form.Field>
			<Dropdown
				placeholder='Select Receiver(s)'
				deburr
				fluid
				multiple
				search
				selection
				options={[...groups, ...students]}
				onChange={(e, data) => { console.log('data', data.value); setReceivers(data.value)}}
			/>
		</Form.Field>
		<Button type='submit'>Send message</Button>
	</Form>
	);
};


const ClientApp = function() {
	return (
		<React.Fragment>
			<Menu>
				<Menu.Item>
					<img src={logo} />
				</Menu.Item>
				<Menu.Menu position="right">
					<Menu.Item>
						<h1>Teacher part</h1>
					</Menu.Item>
				</Menu.Menu>
			</Menu>
			<Grid columns='equal'>
				<Grid.Column>
				</Grid.Column>
				<Grid.Column width={8}>
					<MessageForm/>
				</Grid.Column>
				<Grid.Column>
				</Grid.Column>
			</Grid>

		</React.Fragment>
	);
};

ReactDOM.render(<ClientApp/>, document.getElementById('message-broadcast-teacher-client-container'));


