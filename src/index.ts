import { CARD_SUITS, CARD_TYPES, RESULTS, TURNS } from './enums.js';
import Card from './models/Card.js';
import Game from './models/Game.js';
import Player from './models/Player.js';
import seedrandom from 'seedrandom'
import Hand from './models/Hand.js';
seedrandom('a rando seed 2', { global: true })

function readCard(card: Card): string {
  const cardSymbol: string = CARD_TYPES[card.type]
  return cardSymbol
}

function readResult(hand: Hand): string {
  const resultSymbol: string = RESULTS[hand.getResult()]
  return resultSymbol
}

function takeTurn(turnString: string) {
  game.takeTurn(TURNS[turnString])
}

function getLatestActiveHand(player: Player) {
  return player.getCurrentHand() || player.readHands()[player.readHands().length - 1]
}


const game = new Game()
const player = new Player()
game.addPlayer(player)

game.startRound()

function getWatch() {
  return `
  hand: ${getLatestActiveHand(player).cards.map(readCard).join(' -- ')}
  house: ${game.activeRound.houseView().map(readCard).join(' -- ')}
  is active: ${game.activeRound.active}
  results: ${player.readHands().map(readResult).join(' -- ')}
  `
}
takeTurn
readResult
getLatestActiveHand
getWatch
console.log(readCard(new Card(CARD_TYPES.ACE, CARD_SUITS.CLUB)))