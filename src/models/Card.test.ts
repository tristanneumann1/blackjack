import { CARD_SUITS, CARD_TYPES } from '../enums.js'
import Card from './Card.js'

describe('Card', () => {
  it('has type and suit', () => {
    const threeClubs = new Card(CARD_TYPES.THREE, CARD_SUITS.CLUB)
    const threeDiamonds = new Card(CARD_TYPES.THREE, CARD_SUITS.DIAMOND)
    const jackHearts = new Card(CARD_TYPES.JACK, CARD_SUITS.HEART)
    const aceSpades = new Card(CARD_TYPES.ACE, CARD_SUITS.SPADE)

    expect(threeClubs.suit).toBe(CARD_SUITS.CLUB)
    expect(threeClubs.type).toBe(CARD_TYPES.THREE)
    expect(threeDiamonds.suit).toBe(CARD_SUITS.DIAMOND)
    expect(threeDiamonds.type).toBe(CARD_TYPES.THREE)
    expect(jackHearts.suit).toBe(CARD_SUITS.HEART)
    expect(jackHearts.type).toBe(CARD_TYPES.JACK)
    expect(aceSpades.suit).toBe(CARD_SUITS.SPADE)
    expect(aceSpades.type).toBe(CARD_TYPES.ACE)
  })

  it('can get card value', () => {
    const threeClubs = new Card(CARD_TYPES.THREE, CARD_SUITS.CLUB)
    const fiveDiamond = new Card(CARD_TYPES.FIVE, CARD_SUITS.DIAMOND)
    const tenHearts = new Card(CARD_TYPES.TEN, CARD_SUITS.HEART)
    const jackHearts = new Card(CARD_TYPES.JACK, CARD_SUITS.HEART)
    const queenHearts = new Card(CARD_TYPES.QUEEN, CARD_SUITS.HEART)
    const kingHearts = new Card(CARD_TYPES.KING, CARD_SUITS.HEART)
    const aceSpades = new Card(CARD_TYPES.ACE, CARD_SUITS.SPADE)

    expect(threeClubs.getValue()).toBe(3)
    expect(fiveDiamond.getValue()).toBe(5)
    expect(tenHearts.getValue()).toBe(10)
    expect(jackHearts.getValue()).toBe(10)
    expect(queenHearts.getValue()).toBe(10)
    expect(kingHearts.getValue()).toBe(10)
    expect(aceSpades.getValue()).toBe(1)
  })

  it('checks Ace Value', () => {
    const kingHearts = new Card(CARD_TYPES.KING, CARD_SUITS.HEART)
    const aceSpades = new Card(CARD_TYPES.ACE, CARD_SUITS.SPADE)

    expect(kingHearts.isAce()).toBe(false)
    expect(aceSpades.isAce()).toBe(true)
  })
})