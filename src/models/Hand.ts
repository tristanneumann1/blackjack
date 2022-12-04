import { RESULTS } from '../enums.js';
import { HandValue } from '../interfaces.js';
import Card from './Card.js';

interface HandOptions {
  isSplit?: boolean,
  cards?: Card[]
}

class Hand {
  readonly cards: Card[] = [];
  busted = false
  active = false
  isDoubled = false
  private value: HandValue
  private isSurrendered = false
  private isInsured = false
  private isSplit = false
  private result?: RESULTS = null

  constructor(options: HandOptions = {}) {
    this.isSplit = options.isSplit || false
    this.cards = options.cards || []
  }

  take(card: Card) {
    if (this.busted) {
      throw new Error('cannot draw, hand is busted')
    }
    this.active = true
    this.cards.push(card);
    this.value = this.handValue()
    if(this.value.hardTotal > 21) {
      this.busted = true
      this.active = false
    }
  }

  beatsHouse(houseValue: HandValue) {
    this.active = false
    if(!this.value) {
      this.value = this.handValue()
    }

    if(this.value.isBlackJack && !houseValue.isBlackJack) {
      this.result = RESULTS.BLACK_JACK
      return
    }
    if (this.value.isBlackJack && houseValue.isBlackJack) {
      this.result = RESULTS.PUSH
      return
    }
    if(houseValue.isBlackJack) {
      this.result = RESULTS.LOSE
      return
    }
    
    if(this.busted) {
      this.result = RESULTS.LOSE
      return
    }
    if(houseValue.softTotal > 21) {
      this.result = RESULTS.WIN
      return
    }

    if(this.value.softTotal > houseValue.softTotal) {
      this.result = RESULTS.WIN
      return
    }
    if(this.value.softTotal === houseValue.softTotal) {
      this.result = RESULTS.PUSH
      return
    }
    this.result = RESULTS.LOSE
  }

  getHandSize(): number {
    return this.cards.length
  }

  getIsPair(): boolean {
    return this.cards.length === 2 && this.cards[0].getValue() === this.cards[1].getValue()
  }

  getIsSplit(): boolean {
    return this.isSplit
  }

  getIsSurrendered(): boolean {
    return this.isSurrendered
  }

  getIsInsured(): boolean {
    return this.isInsured
  }

  getResult(): RESULTS {
    return this.result
  }

  split(): Hand {
    this.isSplit = true
    const splitHand = new Hand({ isSplit: true, cards: [this.cards.pop()] })
    return splitHand
  }

  double() {
    this.isDoubled = true
  }

  surrender() {
    this.isSurrendered = true
  }

  insure() {
    this.isInsured = true
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
}

export default Hand