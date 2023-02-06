<script lang=ts>
	import { username } from 'src/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Action, EEvent } from 'src/models/enums/action.enum';
	let room = '';
	let user_name = '';
	let socket: WebSocket;

	onMount(() => {
		socket = new WebSocket('ws://localhost:8080/ws');

		socket.addEventListener('open', (event) => {
			console.log('WebSocket connection established');
		});

		socket.addEventListener('message', (event) => {
			console.log('message received');
			console.log(event.data)
		});
		/**
		 * Use name and url from local storage to pre-populate form
		 * when available.
		 */
		const storedUrl = localStorage?.getItem('DAILY_SVELTE_URL');
		if (storedUrl) {
			room = storedUrl;
		}
		const storedName = localStorage?.getItem('DAILY_SVELTE_NAME');
		if (storedName) {
			user_name = storedName;
		}
	});

	async function sendMessage(message: any): Promise<any> {
		return new Promise((resolve, reject) => {
			socket.onmessage =  (event) => {
				const response = JSON.parse(event.data);
				resolve(response);
			};
			socket.onerror =  (error) => {
				reject(error);
			};
			socket.send(JSON.stringify(message));
		});

	}

	async function submitForm() {
		let message;
		if (room) {
			message = {action: Action.JOIN_ROOM}
		} else {
			message = {action: Action.CREATE_ROOM}
		}
		sendMessage(message)
			.then(response => {
				if (response.event == EEvent.ERROR) {
					alert(`Failed to ${room ? 'join room' : 'create room'}`)
					return
				}
				// Set Daily name in store for future use
				username.set(user_name);
				goto(`/game`);
			}).catch(err => {
				alert("Failed to send message")
			})
		
		
	}
</script>

<!-- In this form, the username is required for the call but
	the Daily URL is optional. If left empty, we will create
	a new Daily room using VITE_DAILY_API_KEY. -->
<form on:submit|preventDefault={submitForm}>
	<label for="name">Your name</label>
	<input id="name" type="text" bind:value={user_name} required />
	<label for="room">Room (leave empty to create a new room)</label>
	<input id="room" type="text" bind:value={room} />
	<input type="submit" value={!room ? 'Create room' : 'Join room'} />
</form>

<style>
	form {
		width: 300px;
	}
	label,
	input {
		display: block;
	}
	input {
		padding: 8px;
		border: 1px solid #c8d1dc;
		border-radius: 12px;
		width: 100%;
		font-family: Helvetica, Arial, sans-serif;
	}
	input[type='submit'] {
		margin: 1rem auto 0;
		width: 100px;
		font-size: 12px;
		background-color: #1bebb9;
		font-weight: 700;
		cursor: pointer;
	}
	label {
		font-size: 12px;
		color: #6b7785;
		text-align: left;
		margin: 8px 0 4px;
	}
</style>
