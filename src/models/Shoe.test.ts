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
})