import Shoe from './Shoe.js';
import { v4 } from 'uuid';
import Player from './Player.js';
import Hand from './Hand.js';
import Card from './Card.js';
import { HandValue } from '../interfaces.js';

class Round {
  active = false;
  readonly id: string;
  private shoe: Shoe;
  private players: Player[] = [];
  private house: Hand
  private playerIndex = 0

  constructor (shoe: Shoe = new Shoe(), id: string = v4()) {
    this.id = id
    this.shoe = shoe
  }

  start() {
    if(this.active) {
      throw new Error('round already started')
    }
    if(!this.players.length) {
      throw new Error('no players available')
    }
    this.deal()
    this.dealHouse()
    this.active = true;
  }

  houseView(): Card[] {
    if (this.active) {
      return [this.house.cards[0]]
    }
    return this.house.cards
  }

  houseValue(): HandValue {
    return this.house.getHandValue()
  }

  addPlayer(player: Player = new Player()): void {
    this.players.push(player)
  }
  
  getActivePlayer(): Player | null {
    return this.players[this.playerIndex] || null
  }

  canInsure(): boolean {
    return this.houseView()[0].isAce()
  }

  canTakeTurn(): boolean {
    return this.active && this.playerIndex < this.players.length
  }

  endTurn() {
    this.getActivePlayer().changeHand()
    if (!this.getActivePlayer().getCurrentHand()) {
      this.playerIndex++
    }
    if (!this.getActivePlayer()) {
      this.endRound()
    }
  }

  endRound() {
    if(this.getActivePlayer()) {
      throw new Error('cannot end round')
    }
    this.takeHouseTurn()
    for (const player of this.players) {
      for (const round of player.readHands()) {
        round.beatsHouse(this.houseValue())
      }
    }
    this.active = false
  }
  
  private deal(): void {
    for (const player of this.players) {
      const hand = new Hand()
      this.shoe.draw(2).forEach(hand.take.bind(hand))
      player.dealHand(hand)
    }
  }
  private dealHouse(): void {
    const hand = new Hand()
    this.shoe.draw(2).forEach(hand.take.bind(hand))
    this.house = hand
  }

  private takeHouseTurn() {
    let houseValue: HandValue = this.house.getHandValue()
    while (houseValue.hardTotal < 17 && houseValue.softTotal < 18) {
      this.house.take(this.shoe.draw()[0])
      houseValue = this.house.getHandValue()
    }
  }
}

export default Round