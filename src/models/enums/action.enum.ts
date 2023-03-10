export enum Action {
    JOIN_ROOM = 0,
	LEAVE_ROOM,
	CREATE_ROOM,
	SEND_HIT,
	SEND_STAND,
	SEND_BET,
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
	NEXT_PLAYER,
	PLAYER_HIT,
	PLAYER_STAND,
	GAME_START_NEW_CARD_DEALER,
	PLAYER_BET,
	DEALER_HIT,
	CARD_REVEAL,
	DEALER_CARD_REVEAL,
	PLAYER_LEFT,
	ONGOING_GAME,
	PROGRESS_UPDATE,
}
