export enum EProgress {
	Betting = 0,
	NewGame,
	BlackjackDealt,
	PlayersTurn,
	DealerTurn,
	GameOver
};

export const NumToProgress = [
	EProgress.Betting,
	EProgress.NewGame,
	EProgress.BlackjackDealt,
	EProgress.PlayersTurn,
	EProgress.DealerTurn,
	EProgress.GameOver
 ]