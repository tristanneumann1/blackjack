import { CARD_SUITS, CARD_TYPES, TURNS } from '../enums.js'
import Card from './Card.js'
import { getFilledShoe, handFactory, playerWithFundsFactory, playerWithHand, roundFactory } from '../../test/utils.js'
import Player from './Player.js'
import Round from './Round.js'

describe('Round', () => {
  it('has one test', () => {
    expect(true).toBeTruthy()
  })

  it('gets built', () => {
    const round = new Round()
    expect(round).toBeInstanceOf(Round)
    expect(round.id).toHaveLength(36)
  })

  it('can add a player', () => {
    const round = new Round()
    round.addPlayer()
  })

  it('can\'t start without players start', () => {
    const round = new Round()
    expect(() => round.start()).toThrowError('no players available')
  })

  it('can\'t be started twice', () => {
    const round = new Round(getFilledShoe())
    round.addPlayer()
    round.start()
    expect(() => round.start()).toThrowError('round already started')
  })

  it('deals all players a hand when started', () => {
    const player1 = new Player()
    const player2 = new Player()
    const round = new Round(getFilledShoe())
    round.addPlayer(player1)
    round.addPlayer(player2)

    round.start()

    const player1Hands = player1.readHands()
    const player2Hands = player2.readHands()
    expect(player1Hands.length).toBe(1)
    expect(player2Hands.length).toBe(1)

    expect(player1Hands[0].getHandSize()).toBe(2)
    expect(player2Hands[0].getHandSize()).toBe(2)
  })

  it('deals a hand to the house', () => {
    const round = new Round(getFilledShoe())
    round.addPlayer()

    round.start()

    expect(round.houseView()).toHaveLength(1)
    expect(round.houseView()[0]).toBeInstanceOf(Card)
  })

  it('can end round if all players finished', () => {
    const round = new Round(getFilledShoe())
    round.addPlayer(new Player())
    round.start()

    round.endTurn()

    expect(round.active).toBe(false)
  })

  it('house draws if hard total is below 16', () => {
    const round = new Round(getFilledShoe({ type: CARD_TYPES.THREE }))
    round.addPlayer(new Player())
    round.start()

    round.endTurn()

    expect(round.houseValue()).toEqual({
      hardTotal: 18,
      softTotal: 18,
      isSoft: false,
      isBlackJack: false
    })
  })
  
  it('house draws if soft and soft total is below 17 ', () => {
    const round = new Round(getFilledShoe({ cards: [
      new Card(CARD_TYPES.TEN, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.ACE, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.SIX, CARD_SUITS.CLUB),
      new Card(CARD_TYPES.TEN, CARD_SUITS.CLUB), // player card
      new Card(CARD_TYPES.TEN, CARD_SUITS.CLUB) //player card
    ] }))
    round.addPlayer(new Player())
    round.start()

    round.endTurn()

    expect(round.houseValue()).toEqual({
      hardTotal: 17,
      softTotal: 17,
      isSoft: false,
      isBlackJack: false
    })
  })

  it('calculates all results of active hands as round ends', () => {
    const round = new Round(getFilledShoe())
    const player1 = new Player()
    const player2 = new Player()
    round.addPlayer(player1)
    round.addPlayer(player2)
    round.start()

    round.endTurn()
    round.endTurn()

    const hands = player1.readHands().concat(player2.readHands())
    expect(hands.length).toBe(2)
    hands.forEach(hand => {
      expect(hand.getResult()).not.toBe(null)
    })
  })

  it('pays off player at the end of a round', () => {
    const player = playerWithFundsFactory(100, 10)
    player.dealHand(handFactory(10, 10))

    const houseHand = handFactory(10, 7)

    const round = roundFactory(houseHand, player)
    round.endTurn()

    expect(player.funds).toBe(110)
  })

  it('disactivates hands after the round is ended', () => {
    const player = playerWithHand(10, 10)
    const round = roundFactory(handFactory(), player)

    round.endTurn()

    expect(player.readHands().length).toBe(1)
    expect(player.readHands()[0].getActive()).toBe(false)
    expect(player.activeHands().length).toBe(0)
  })

  it('can check correct turn', () => {
    const round = roundFactory(handFactory(10), playerWithHand(10, 9))

    expect(round.getExpectedTurn()).toBe(TURNS.STAND)
  })
})