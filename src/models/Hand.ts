import { RESULTS } from '../enums.js';
import { HandValue } from '../interfaces.js';
import Card from './Card.js';

interface HandOptions {
  isSplit?: boolean,
  cards?: Card[],
  active?: boolean
}

class Hand {
  readonly cards: Card[] = [];
  active = false
  private bet = 0
  private isDoubled = false
  private isSurrendered = false
  private isInsured = false
  private isSplit = false
  private houseBlackJack = false
  private result?: RESULTS = null

  constructor(options: HandOptions = {}) {
    this.isSplit = options.isSplit || false
    this.cards = options.cards || []
    this.active = options.active || false
  }

  take(card: Card) {
    if (this.isBusted()) {
      throw new Error('cannot draw, hand is busted')
    }
    this.active = true
    this.cards.push(card);
    if(this.isBusted()) {
      this.active = false
    }
  }

  getHandSize(): number {
    return this.cards.length
  }

  beatsHouse(houseValue: HandValue) {
    const value = this.getHandValue()

    if(houseValue.isBlackJack) {
      this.houseBlackJack = true
    }

    if(value.isBlackJack && !houseValue.isBlackJack) {
      this.result = RESULTS.BLACK_JACK
      return
    }
    if (value.isBlackJack && houseValue.isBlackJack) {
      this.result = RESULTS.PUSH
      return
    }
    if(houseValue.isBlackJack) {
      this.result = RESULTS.LOSE
      return
    }
    
    if(value.softTotal > 21) {
      this.result = RESULTS.LOSE
      return
    }
    if(houseValue.softTotal > 21) {
      this.result = RESULTS.WIN
      return
    }

    if(value.softTotal > houseValue.softTotal) {
      this.result = RESULTS.WIN
      return
    }
    if(value.softTotal === houseValue.softTotal) {
      this.result = RESULTS.PUSH
      return
    }
    this.result = RESULTS.LOSE
  }

  getHandValue(): HandValue {
    const total = this.cards.reduce((total, card) => total + card.getValue(), 0)
    const value = {
      hardTotal: total,
      softTotal: total,
      isSoft: false,
      isBlackJack: false
    }
    if (total <= 11 && this.cards.find(card => card.isAce())) {
      value.softTotal += 10
      value.isSoft = true
    }
    if (value.softTotal === 21 && this.cards.length === 2) {
      value.isBlackJack = true
    }
    return value
  }

  isBusted(): boolean {
    return this.getHandValue().softTotal > 21
  }
  
  getResult(): RESULTS {
    return this.result
  }

  setBet(bet: number) {
    this.bet = bet
  }

  getBet(): number {
    return this.bet
  }

  getIsPair(): boolean {
    return this.cards.length === 2 && this.cards[0].getValue() === this.cards[1].getValue()
  }

  split(): Hand {
    this.isSplit = true
    const splitHand = new Hand({ isSplit: true, cards: [this.cards.pop()] })
    return splitHand
  }

  getIsSplit(): boolean {
    return this.isSplit
  }

  surrender() {
    this.isSurrendered = true
  }

  getIsSurrendered(): boolean {
    return this.isSurrendered
  }

  insure() {
    this.isInsured = true
  }

  getIsInsured(): boolean {
    return this.isInsured
  }

  getHouseBlackJacked(): boolean{
    return this.houseBlackJack
  }

  double() {
    this.isDoubled = true
    this.bet *= 2
  }

  getIsDoubled() {
    return this.isDoubled
  }
}

export default Hand