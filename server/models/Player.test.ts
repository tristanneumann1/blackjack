import { handFactory, handValueFactory, playerWithFundsFactory } from '../../test/utils.js'
import { CARD_SUITS, CARD_TYPES } from '../enums.js'
import Card from './Card.js'
import Hand from './Hand.js'
import Player from './Player.js'

describe('Player', () => {
  it('is given an id', () => {
    const player = new Player()

    expect(player.id.length).toBe(36)
  })
  
  it('can be dealt a hand', () => {
    const player = new Player()
    const hand = new Hand()

    player.dealHand(hand)
  
    expect(player.readHands().length).toBe(1)  
    expect(player.getCurrentHand()).toBe(hand)  
  })

  it('gives access to active hands', () => {
    const player = new Player()

    const firstHand = new Hand()
    player.dealHand(firstHand)
    player.dealHand(new Hand())
  
    expect(player.activeHands().length).toBe(2)
    expect(player.getCurrentHand()).toBe(firstHand)  
  })

  it('can swap to next hand', () => {
    const player = new Player()

    const secondHand = new Hand()
    player.dealHand(new Hand())
    player.dealHand(secondHand)
  
    player.changeHand()

    expect(player.getCurrentHand()).toBe(secondHand)  
  })

  it('can store funds', () => {
    const player = new Player()
    player.addFunds(3000)

    expect(player.funds).toBe(3000)
  })

  it('only allows positive bet sizes', () => {
    const player = new Player()
    expect(() => player.setBetSize(-10)).toThrowError('invalid bet size')
    expect(() => player.setBetSize(4.6)).toThrowError('invalid bet size')
  })

  it('can not deal hand if not enough funds', () => {
    const player = new Player()
    player.addFunds(10)
    player.setBetSize(100)

    expect(() => player.dealHand(new Hand())).toThrowError('insufficient funds')
  })

  it('sets bet size on hand', () => {
    const player = new Player()
    player.addFunds(100)
    player.setBetSize(10)

    const hand = new Hand()
    player.dealHand(hand)

    expect(hand.getBet()).toBe(10)
    expect(player.funds).toBe(90)
  })

  it('cannot double, split, or insure a hand if insufficient funds', () => {
    const player = new Player()
    player.addFunds(100)
    player.setBetSize(100)

    const hand = new Hand()
    hand.take(new Card(CARD_TYPES.TWO, CARD_SUITS.CLUB))
    hand.take(new Card(CARD_TYPES.TWO, CARD_SUITS.HEART))
    player.dealHand(hand)

    expect(player.canDouble()).toBe(false)
    expect(player.canSplit()).toBe(false)
    expect(player.canInsure()).toBe(false)
  })

  it('cannot hit if no active hand, or hand is busted', () => {
    const player = new Player()

    expect(player.canHit()).toBe(false)
    
    player.dealHand(handFactory(10, 10, 10))
    
    expect(player.canHit()).toBe(false)
  })

  describe('payouts', () => {
    it('leaves money on a loss', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand = handFactory(CARD_TYPES.TEN, CARD_TYPES.TEN, CARD_TYPES.TEN)
      hand.beatsHouse(handValueFactory())

      player.dealHand(hand)
      player.payOut()
  
      expect(player.funds).toBe(90)
    })

    it('rewards with bet on a win', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand = handFactory(CARD_TYPES.TEN, CARD_TYPES.TEN)
      hand.beatsHouse(handValueFactory({ softTotal: 17 }))
      
      player.dealHand(hand)
      player.payOut()
  
      expect(player.funds).toBe(110)
    })
    

    it('rewards blackjack with 3 : 2', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand = handFactory(CARD_TYPES.ACE, CARD_TYPES.TEN)
      hand.beatsHouse(handValueFactory())
      
      player.dealHand(hand)
      player.payOut()
  
      expect(player.funds).toBe(115)
    })

    it('rewards every active hand', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand1 = handFactory(CARD_TYPES.TEN, CARD_TYPES.TEN)
      const hand2 = handFactory(CARD_TYPES.TEN, CARD_TYPES.TEN)
      hand1.beatsHouse(handValueFactory({ softTotal: 27 }))
      hand2.beatsHouse(handValueFactory({ softTotal: 27 }))
      
      player.dealHand(hand1)
      player.dealHand(hand2)
      player.payOut()
  
      expect(player.funds).toBe(120)
    })
    
    it('returns half the profits on a surrender', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand = handFactory()
      hand.beatsHouse(handValueFactory())
      hand.surrender()
      
      player.dealHand(hand)
      player.payOut()
  
      expect(player.funds).toBe(95)
    })
    
    it('returns double the profits on a doubled win', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand = handFactory(CARD_TYPES.TEN, CARD_TYPES.TEN)
      hand.beatsHouse(handValueFactory({ softTotal: 27 }))
      
      player.dealHand(hand)
      player.double()
      player.payOut()
  
      expect(player.funds).toBe(120)
    })

    it('takes double if doubled and lost', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand = handFactory(CARD_TYPES.TEN, CARD_TYPES.THREE)
      hand.beatsHouse(handValueFactory({ softTotal: 17 }))
      
      player.dealHand(hand)
      player.double()
      player.payOut()
  
      expect(player.funds).toBe(80)
    })
    
    it('returns bet on a push', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand = handFactory(CARD_TYPES.TEN, CARD_TYPES.TEN)
      hand.beatsHouse(handValueFactory({ softTotal: 20 }))
      
      player.dealHand(hand)
      player.payOut()
  
      expect(player.funds).toBe(100)
    })

    it('pays 2:1 if insurance taken on a blackjack', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand = handFactory()
      hand.insure()
      hand.beatsHouse(handValueFactory({ isBlackJack: true }))
      
      player.dealHand(hand)
      player.payOut()
  
      expect(player.funds).toBe(110)
    })

    it('does not payout disactive hands', () => {
      const player = playerWithFundsFactory(100, 10)
      const hand = handFactory(CARD_TYPES.TEN, CARD_TYPES.TEN)
      hand.beatsHouse(handValueFactory({ softTotal: 27 }))
      hand.disactivate()
      
      player.dealHand(hand)
      player.payOut()
  
      expect(player.funds).toBe(90)
    })
  })
})