import { tick } from "svelte";
import { get, writable, type Updater, type Writable } from "svelte/store";
import { createCard2 } from "./functions/card";
import { addCardsToHand, createHand, pause } from "./functions/gameplay";
import type { PlayerData, Response } from "./models/api/draw-data.interface";
import { EEvent } from "./models/enums/action.enum";
import { EDuration } from "./models/enums/duration.enum";
import { EProgress, NumToProgress } from "./models/enums/progress.enum";
import type { ICard } from "./models/interfaces/card.interface";
import type { IHand } from "./models/interfaces/hand.interface";

let socket: WebSocket;
export const userId = writable<string>("")
export const otherPlayersBet = writable(new Map<string, number>())
export const progressStore = writable<EProgress>(EProgress.Betting)
export const idToName = writable<Map<string, string>>(new Map())
export const playerTurn = writable<string>("");
export const playerHand = writable<IHand>(createHand());
export const dealerHand = writable<IHand>(createHand());
export const otherPlayersHand = writable<Map<string, IHand>>(new Map());

export function resetStores(resetAll: boolean) {
    if (resetAll) {
        idToName.set(new Map())
    }
    otherPlayersBet.set(new Map())
    progressStore.set(EProgress.Betting)
    playerTurn.set("")

    // reset hands
    playerHand.set(createHand())
    dealerHand.set(createHand())
    otherPlayersHand.update(hands => {
        for (const key of hands.keys()) {
            hands.set(key, createHand())
        }
        return hands;
    })
}

export async function connect() {
  socket = new WebSocket('ws://localhost:8080/ws');

  socket.addEventListener('message', (event) => {
    console.log('message received');
    const response: Response = JSON.parse(event.data);
    if (!response) {
        return;
    }
    switch (response.event) {
        case EEvent.PLAYER_ADDED:
            userId.set(response.playerId!)
            break;
        case EEvent.GAME_START_NEW_CARD_DEALER:
            setNewCards(response, dealerHand);
            break;
        case EEvent.PLAYER_HIT:
            if (response.affectedUser === get(userId)) {
                setNewCards(response, playerHand)
            } else if (response.affectedUser) {
                setOtherPlayerNewCards(response, otherPlayersHand)
            }
            break;
        case EEvent.JOINED_ROOM:
            otherPlayersHand.update(map => prepareNewPlayersMap(map, response.allPlayers!, createHand()))
            otherPlayersBet.update(map => prepareNewPlayersMap(map, response.allPlayers!, 0))
            idToName.set(constructIdentityMap(response))
            break;
        case EEvent.PLAYER_BET:
            otherPlayersBet.update(map => {
                map.set(response.affectedUser!, response.betAmount)
                return map
            })
            break;
        case EEvent.NEXT_PLAYER:
            playerTurn.set(response.nextPlayer!)
            break;
        case EEvent.DEALER_HIT:
            setNewCards(response, dealerHand)
            break;
        case EEvent.CARD_REVEAL:
            if (response.affectedUser === get(userId)) {
                break;
            }
            setOtherPlayerNewCards(response, otherPlayersHand)
            break;
        case EEvent.DEALER_CARD_REVEAL:
            setNewCards(response, dealerHand)
            break;
        case EEvent.PLAYER_LEFT:
            otherPlayersBet.update(deleteUserFromMap(response.affectedUser!))
            otherPlayersHand.update(deleteUserFromMap(response.affectedUser!))
            idToName.update(deleteUserFromMap(response.affectedUser!))
            break;
        case EEvent.ONGOING_GAME:
            setupOngoingPlayers(response)
            break;
        case EEvent.PROGRESS_UPDATE:
            const progress = NumToProgress[response.progress!]
            progressStore.set(progress)
            if (progress == EProgress.Betting) {
                resetStores(false)
            }
            break;
        default:
            break;
    }
    });
}

function setupOngoingPlayers(response: Response) {
    const cards: Map<string, IHand> = new Map()
    const bets: Map<string, number> = new Map()
    const ids: Map<string, string> = new Map()
    for (const player of response.allPlayers!) {
        if (player.id === "dealer") {
            const dealerCards = player.hand.map(card => createCard2(card))
            const newHand = setNewCardsToHand(dealerCards, createHand())
            dealerHand.set(newHand)
        } else {
            const playerCards = player.hand.map(card => createCard2(card))
            const newHand = setNewCardsToHand(playerCards, createHand())
            cards.set(player.id, newHand)
            bets.set(player.id, player.bet)
            ids.set(player.id, player.name)
        }
    }
    otherPlayersBet.set(bets)
    otherPlayersHand.set(cards)
    idToName.set(ids)
}

function deleteUserFromMap<K, T>(userId: K): Updater<Map<K, T>> {
    return (map: Map<K, T>) => {
        map.delete(userId);
        return map;
    }
}

function constructIdentityMap(response: Response) {
    return new Map(response.allPlayers?.map(player => [player.id, player.name]));
}

function prepareNewPlayersMap<T>(map: Map<string, T>, players: PlayerData[], zeroValue: T): Map<string, T> {
    for (const identity of players) {
        if (map.has(identity.id) || identity.id === get(userId)) {
            continue;
        }
        map.set(identity.id, zeroValue);
    }
    return map
}

async function setNewCards(response: Response, hand: Writable<IHand> | undefined) {
    if (!hand) {
        return;
    }
    for (const card of response.newCards!) {
        const newCard = createCard2(card, response.event === EEvent.DEALER_CARD_REVEAL)
        hand.set(setNewCardsToHand([newCard], get(hand)));
        await tick()
        await pause(EDuration.Card)
    }
}

function setNewCardsToHand(cards: ICard[], hand: IHand) {
    for (const card of cards) {
        hand = addCardsToHand(hand, card)
    }
    return hand
}

async function setOtherPlayerNewCards(response: Response, hands: Writable<Map<string, IHand>>) {
    if (!hands) {
        return;
    }
    const playerId = response.affectedUser!
    const event = response.event
    for (const card of response.newCards!) {
        const newHand = setNewCardsToHand([createCard2(card, event === EEvent.CARD_REVEAL)], get(hands).get(playerId) ?? createHand())
        hands.update(hand => {
            hand.set(playerId, newHand)
            return hand
        })
        await tick()
        await pause(EDuration.Card)
    }
}

export async function sendMessage(message: any): Promise<Response> {
    return new Promise((resolve, reject) => {
        socket.onmessage =  (event) => {
            const response: Response = JSON.parse(event.data);
            resolve(response);
        };
        socket.onerror =  (error) => {
            reject(error);
        };
        socket.send(JSON.stringify(message));
    });
}

export function disconnect() {
  if (socket) {
    socket.close();
  }
}
