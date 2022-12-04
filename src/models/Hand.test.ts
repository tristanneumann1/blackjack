import { CARD_SUITS, CARD_TYPES, RESULTS } from '../enums.js'
import { HandValue } from '../interfaces.js'
import Card from './Card.js'
import Hand from './Hand.js'

function cardFactory(type = 'TEN', suit = 'HEART') {
  return new Card(CARD_TYPES[type], CARD_SUITS[suit])
}
function handValueFactory(total = 17): HandValue {
  return {
    hardTotal: total,
    softTotal: total,
    isBlackJack: false,
    isSoft: false
  }
}

describe('Hand', () => {
  it('is initialised', () => {
    const hand = new Hand()
    expect(hand.busted).toBe(false)
    expect(hand.active).toBe(false)
  })

  it('can draw cards', () => {
    const hand = new Hand()
    hand.take(cardFactory())
    hand.take(cardFactory('FIVE'))
    hand.take(cardFactory('TWO'))

    expect(hand.busted).toBe(false)
    expect(hand.active).toBe(true)

    expect(hand.value).toEqual(handValueFactory(10 + 5 + 2))
    expect(hand.getHandSize()).toBe(3)
  })

  it('busts and cannot draw cards when busted', () => {
    const hand = new Hand()
    hand.take(cardFactory())
    hand.take(cardFactory())
    hand.take(cardFactory())

    expect(hand.busted).toBe(true)
    expect(hand.active).toBe(false)
    
    expect(() => hand.take(cardFactory())).toThrow('cannot draw, hand is busted')
  })

  it('finds blackjack', () => {
    const hand = new Hand()
    hand.take(cardFactory())
    hand.take(cardFactory('ACE'))

    expect(hand.busted).toBe(false)
    expect(hand.value).toEqual({
      hardTotal: 11,
      softTotal: 21,
      isSoft: true,
      isBlackJack: true
    })
  })
    
  it('handles soft totals', () => {
    const hand = new Hand()
    hand.take(cardFactory('TWO'))
    hand.take(cardFactory('ACE'))
    const expectValue = handValueFactory(13)

    expectValue.hardTotal = 3
    expectValue.isSoft = true
    
    expect(hand.value).toEqual(expectValue)

    hand.take(cardFactory())
    expect(hand.value).toEqual(handValueFactory(13))
  })

  describe('beatsHouse', () => {
    it('goes inactive', () => {
      const hand = new Hand()
      hand.beatsHouse(handValueFactory())
      expect(hand.active).toBe(false)
    })
    
    it('handles player BJ', () => {
      const hand = new Hand()
      hand.take(cardFactory('TEN'))
      hand.take(cardFactory('ACE'))

      hand.beatsHouse(handValueFactory())

      expect(hand.getResult()).toBe(RESULTS.BLACK_JACK)
    })
    
    it('handles both BJ', () => {
      const hand = new Hand()
      hand.take(cardFactory('ACE'))
      hand.take(cardFactory('TEN'))
      const blackJack = handValueFactory()
      blackJack.isBlackJack = true

      hand.beatsHouse(blackJack)

      expect(hand.getResult()).toBe(RESULTS.PUSH)
    })
    
    
    it('handles house BJ', () => {
      const hand = new Hand()
      hand.take(cardFactory())
      hand.take(cardFactory())
      const blackJack = handValueFactory()
      blackJack.isBlackJack = true

      hand.beatsHouse(blackJack)

      expect(hand.getResult()).toBe(RESULTS.LOSE)
    })
    
    it('handles busted', () => {
      const hand = new Hand()
      hand.take(cardFactory('TEN'))
      hand.take(cardFactory('TEN'))
      hand.take(cardFactory('TEN'))
      const house = handValueFactory()

      hand.beatsHouse(house)

      expect(hand.getResult()).toBe(RESULTS.LOSE)
    })
    
    it('handles win', () => {
      const hand = new Hand()
      hand.take(cardFactory('TEN'))
      hand.take(cardFactory('TEN'))
      const house = handValueFactory(17)

      hand.beatsHouse(house)

      expect(hand.getResult()).toBe(RESULTS.WIN)
    })
    
    it('handles push', () => {
      const hand = new Hand()
      hand.take(cardFactory('TEN'))
      hand.take(cardFactory('TEN'))
      const house = handValueFactory(20)

      hand.beatsHouse(house)

      expect(hand.getResult()).toBe(RESULTS.PUSH)
    })
    
    it('handles lose', () => {
      const hand = new Hand()
      hand.take(cardFactory('THREE'))
      hand.take(cardFactory('TEN'))
      const house = handValueFactory(17)

      hand.beatsHouse(house)

      expect(hand.getResult()).toBe(RESULTS.LOSE)
    })
  })
})
