import { CARD_SUITS, CARD_TYPES } from '../enums.js'

class Card {
  readonly type: CARD_TYPES
  readonly suit: CARD_SUITS

  constructor(type: CARD_TYPES, suit: CARD_SUITS) {
    this.type = type
    this.suit = suit
  }

  getValue() {
    if (this.type === CARD_TYPES.ACE) {
      return 1
    }
    if (this.type > CARD_TYPES.NINE) {
      return 10
    }
    return this.type
  }

  isAce(): boolean {
    return this.type === CARD_TYPES.ACE
  }
}

export default Card
