import { getFilledShoe } from '../../test/utils.js'
import { CARD_SUITS, CARD_TYPES } from '../enums.js'
import Card from './Card.js'
import Shoe from './Shoe.js'

describe('Shoe', () => {
  it('can be built', () => {
    const shoe = new Shoe()
    expect(shoe).toBeInstanceOf(Shoe)
    expect(shoe.getSize()).toBe(0)
  })

  it('can be filled', () => {
    const shoe = new Shoe()
    shoe.fill()

    expect(shoe.getSize()).toBe(52 * 4)
  })

  it('throws an error when no card can be dealt', () => {
    const shoe = new Shoe()
    expect(() => shoe.draw()).toThrowError('no cards can be drawn')
  })

  it('gives a card when asked', () => {
    const shoe = new Shoe()
    shoe.fill()
    const cards = shoe.draw(3)
    expect(cards.length).toBe(3)
    cards.forEach(card => {
      expect(card).toBeInstanceOf(Card)
    });
    expect(cards[0])
  })

  it('maintains a count', () => {
    const shoe = getFilledShoe({ cards: [
      new Card(CARD_TYPES.ACE, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.KING, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.QUEEN, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.JACK, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.TEN, CARD_SUITS.CLUB),

      new Card(CARD_TYPES.TWO, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.THREE, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.FOUR, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.FIVE, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.SIX, CARD_SUITS.CLUB)
    ]})

    expect(shoe.getCount()).toBe(0)

    shoe.draw(5)
    expect(shoe.getCount()).toBe(5)

    shoe.draw(5)
    expect(shoe.getCount()).toBe(0)
  })

  it('resets count to 0 after fill', () => {
    const shoe = new Shoe()
    shoe.fill()
    shoe.draw(10)
    shoe.fill()

    expect(shoe.getCount()).toBe(0)
  })
})