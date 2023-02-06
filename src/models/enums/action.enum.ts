export enum Action {
    JOIN_ROOM = 0,
	LEAVE_ROOM,
	CREATE_ROOM,
	START_GAME,

	SEND_HIT,
	SEND_STAND,
}
export enum EEvent {
	PLAYER_ADDED = 0,
	ROOM_CREATED,
	JOINED_ROOM,
	LEFT_ROOM,
	ERROR,
	GAME_WIN,
	GAME_LOST,
	GAME_DRAW,
	YOUR_TURN,
	NEXT_PLAYER,
	PLAYER_HIT,
	PLAYER_STAND,
	GAME_START_NEW_CARD,s
}

