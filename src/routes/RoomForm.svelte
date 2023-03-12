<script lang=ts>
	import { roomId, username } from 'src/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Action, EEvent } from 'src/models/enums/action.enum';
	import { connect, disconnect, resetStores, sendMessage } from 'src/socket';
	let room = '';
	let user_name = '';

	onMount(() => {
		disconnect()
		connect();
	});

	async function submitForm() {
		let message;
		if (room) {
			message = {action: Action.JOIN_ROOM, roomId: room, name: user_name}
		} else {
			message = {action: Action.CREATE_ROOM, name: user_name}
		}
		sendMessage(message)
			.then(response => {
				if (response.event == EEvent.ERROR) {
					alert(`Failed to ${room ? 'join room' : 'create room'}`)
					return
				}
				// Set Daily name in store for future use
				username.set(user_name);
				roomId.set(response.roomId ?? room);
				goto(`/game`);
			}).catch(err => {
				alert("Failed to send message")
				console.log(err)
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
