import { CARD_SUITS, CARD_TYPES } from './enums.js';
import Card from './models/Card.js';
import Game from './models/Game.js';
import Hand from './models/Hand.js';
import Player from './models/Player.js';

export interface PlayerDTO {
  id: string,
  funds: number,
  betSize: number,
  hands?: HandDTO[]
}

export interface GameDTO {
  activeRound?: RoundDTO
}

export interface RoundDTO {
  players: PlayerDTO[]
  houseView: CardDTO[] 
}

interface HandDTO {
  // is insured & more?
  cards: CardDTO[]
}

interface CardDTO {
  visible: boolean
  cardType?: CARD_TYPES,
  cardSuit?: CARD_SUITS
}

export function playerToDTO(player: Player): PlayerDTO {
  let hands: HandDTO[] = null
  if (player.activeHands().length) {
    hands = player.activeHands().map(handToDTO)
  }
  const dto: PlayerDTO = {
    id: player.id,
    funds: player.funds,
    betSize: player.betSize
  }

  if (hands) {
    dto.hands = hands
  }

  return dto
}

export function gameToDTO(game: Game) : GameDTO {
  const activeRound = game.activeRound
  if (!activeRound) {
    return {
      activeRound: null
    }
  }

  const houseView = activeRound.houseView()

  const players = activeRound.players
  
  const roundDto: RoundDTO = {
    houseView: houseView.map(cardToDTO),
    players: players.map(playerToDTO)
  }
  return {
    activeRound: roundDto
  }
}

function cardToDTO(card: Card) : CardDTO {
  if (!card) {
    return {
      visible: false
    }
  }
  return {
    visible: true,
    cardType: card.type,
    cardSuit: card.suit
  }
}

function handToDTO(hand: Hand): HandDTO {
  return {
    cards: hand.cards.map(cardToDTO)
  }
}