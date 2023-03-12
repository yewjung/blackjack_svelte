import type { EEvent } from "../enums/action.enum";
import type { CardValue } from "../types/card-value";
import type { ICardData } from "./card-data.interface";

export interface IDrawData {
	success: boolean;
	deck_id: string;
	cards: ICardData[];
	remaining: number;
}  

export interface DrawData {
	rank: {
		name: CardValue;
	},
	suit: number;
}

export enum EError {
	ROOM_NOT_EXIST,
	ROOM_ID_NOT_PROVIDED,
	ROOM_ID_FORMAT_WRONG,
	CANNOT_CREATE_ROOM,
	CANNOT_JOIN_ROOM,
}

export interface Response {
	event: EEvent;
	roomId?: string;
	error?: EError;
	playerId?: string;
	nextPlayer?: string;
	affectedUser?: string;
	newCards?: DrawData[];
	betAmount: number;
	allPlayers?: PlayerData[];
	progress?: number;
}

export interface PlayerData {
	id: string;
	name: string;
	bet: number;
	hand: DrawData[];
}