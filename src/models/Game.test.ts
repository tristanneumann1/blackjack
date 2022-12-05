import { CARD_SUITS, CARD_TYPES, TURNS } from '../enums.js'
import Card from './Card.js'
import Game from './Game.js'
import Hand from './Hand.js'
import Player from './Player.js'
import { riggedGameFactory, RiggedGame, playerWithFundsFactory } from '../../test/utils.js'
import Round from './Round.js'

describe('Game', () => {
  it('is initialised', () => {
    const game = new Game()
    expect(game).toBeInstanceOf(Game)
  })

  it('starts a new round', () => {
    const game = new Game()
    const player = new Player()
    game.addPlayer(player)

    game.startRound()
    expect(game.activeRound).toBeInstanceOf(Round)
    expect(game.getActivePlayer()).toBe(player)
    expect(player.readHands().length).toBe(1)
    expect(player.readHands()[0].getHandSize()).toBe(2)
  })

  it('throws error if no round available', () => {
    const game = new Game()
    game.addPlayer(new Player())

    expect(() => game.takeTurn(TURNS.STAND)).toThrowError('cannot take turn')
  })

  it('doesn\'t allow turn if no players left', () => {
    const game = new Game()
    game.addPlayer(new Player())
    game.startRound()

    game.takeTurn(TURNS.STAND)

    expect(() => game.takeTurn(TURNS.STAND)).toThrowError('cannot take turn')
  })

  describe('stand', () => {
    it('allows the taking of a stand turn', () => {
      const game = new Game()
      game.addPlayer(new Player())
      game.startRound()
  
      game.takeTurn(TURNS.STAND)
  
      expect(game.getActivePlayer()).toBe(null)
    })
  })

  describe('hit', () => {
    it('throws error if hand cannot be hit', () => {
      const game = new Game()
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      player.getCurrentHand().active = false
  
      expect(() => game.takeTurn(TURNS.HIT)).toThrow('hand cannot be hit')
    })
    
    it('allows the taking of a hit turn', () => {
      const game = riggedGameFactory(CARD_TYPES.TWO)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      game.takeTurn(TURNS.HIT)
  
      expect(game.getActivePlayer()).toBe(player)
      expect(player.readHands()[0].getHandSize()).toBe(3)
    })
  
    it('changes round if hand is busted', () => {
      const game = riggedGameFactory(CARD_TYPES.TEN)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
      const handToBust = player.getCurrentHand()
  
      game.takeTurn(TURNS.HIT)
  
      expect(handToBust.isBusted()).toBe(true)
      expect(player.getCurrentHand()).toBe(null)
      expect(game.getActivePlayer()).toBe(null)
    })
    
    it('keeps funds if player loses', () => {
      const player: Player = playerWithFundsFactory(100, 10)
      const game = riggedGameFactory(CARD_TYPES.QUEEN)

      game.addPlayer(player)
      game.startRound()
      game.takeTurn(TURNS.HIT)

      game.endRound()

      expect(player.funds).toBe(90)
    })
  })

  describe('double', () => {
    it('doesn\'t allow double if not first card', () => {
      const game = riggedGameFactory(CARD_TYPES.TWO)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      game.takeTurn(TURNS.HIT)
  
      expect(() => game.takeTurn(TURNS.DOUBLE)).toThrowError('cannot double after hitting')
    })
    
    it('doubles the current hand and changes hand', () => {
      const game = riggedGameFactory(CARD_TYPES.TWO)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
      const handToDouble = player.getCurrentHand()
  
      game.takeTurn(TURNS.DOUBLE)
  
      expect(handToDouble.getHandSize()).toBe(3)
      expect(handToDouble.getIsDoubled()).toBe(true)
      expect(game.getActivePlayer()).toBe(null)
    })
  })

  describe('split', () => {
    it('does not allow split if cards are not a pair', () => {
      const game = new RiggedGame(
        [CARD_TYPES.TEN, CARD_TYPES.TEN, CARD_TYPES.FOUR, CARD_TYPES.FIVE].map(value => {
          return new Card(value, CARD_SUITS.CLUB)
        })
      )
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      expect(() => game.takeTurn(TURNS.SPLIT)).toThrowError('cannot split hand')
    })
  
    it('does not allow split if an extra card is drawn', () => {
      const game = new RiggedGame(
        [CARD_TYPES.EIGHT, CARD_TYPES.TWO, CARD_TYPES.TWO, CARD_TYPES.TWO, CARD_TYPES.TWO].map(value => {
          return new Card(value, CARD_SUITS.CLUB)
        })
      )
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      game.takeTurn(TURNS.HIT)
      expect(() => game.takeTurn(TURNS.SPLIT)).toThrowError('cannot split hand')
    })
  
    it('splits hand into two hands for the same player', () => {
      const game = riggedGameFactory(CARD_TYPES.TWO)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      game.takeTurn(TURNS.SPLIT)
  
      const playerHands: Hand[] = player.readHands()
      const playerActiveHand: Hand = player.getCurrentHand()
      const playerOtherHand: Hand = playerHands.filter(hand => hand !== playerActiveHand)[0]
      expect(playerHands.length).toBe(2)
      expect(playerActiveHand.getHandSize()).toBe(2)
      expect(playerOtherHand.getHandSize()).toBe(1)
  
      expect(playerHands[0].getIsSplit()).toBe(true)
      expect(playerHands[1].getIsSplit()).toBe(true)
  
      expect(player.getCurrentHand()).toBe(playerHands[0])
    })
  
    it('plays second hand after first is split', () => {
      const game = riggedGameFactory(CARD_TYPES.TWO)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      game.takeTurn(TURNS.SPLIT)
      game.takeTurn(TURNS.STAND)
  
      expect(game.getActivePlayer()).toBe(player)
      expect(player.getCurrentHand()).toBe(player.readHands()[1])
    })
  
    it('can split more then once', () => {
      const game = riggedGameFactory(CARD_TYPES.TWO)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      game.takeTurn(TURNS.SPLIT)
      game.takeTurn(TURNS.SPLIT)
      game.takeTurn(TURNS.STAND)
      game.takeTurn(TURNS.STAND)
  
  
      expect(game.getActivePlayer()).toBe(player)
      expect(player.getCurrentHand()).toBe(player.readHands()[2])
    })
  })

  describe('surrender', () => {
    it('does not allow surrender if a card has been hit', () => {
      const game = riggedGameFactory(CARD_TYPES.TWO)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      game.takeTurn(TURNS.HIT)
      expect(() => game.takeTurn(TURNS.SURRENDER)).toThrowError('cannot surrender hand')
    })
  
    it('will set hand as surrendered and move on', () => {
      const game = riggedGameFactory(CARD_TYPES.TWO)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
      const handToSurrender = player.getCurrentHand()
  
      game.takeTurn(TURNS.SURRENDER)
  
      expect(handToSurrender.getIsSurrendered()).toBe(true)
      expect(game.getActivePlayer()).toBe(null)
    })
  })

  describe('insurance', () => {
    it('will throw an error if trying to take insurance when house card is not an ace', () => {
      const game = riggedGameFactory(CARD_TYPES.TWO)
      game.addPlayer(new Player())
      game.startRound()
  
      expect(() => game.takeTurn(TURNS.INSURANCE)).toThrowError('cannot insure hand')
    })
  
    it('will throw an error if trying to take insurance when player hit', () => {
      const game = riggedGameFactory(CARD_TYPES.ACE)
      game.addPlayer(new Player())
      game.startRound()
  
      game.takeTurn(TURNS.HIT)
  
      expect(() => game.takeTurn(TURNS.INSURANCE)).toThrowError('cannot insure hand')
    })
  
    it('can insure', () => {
      const game = riggedGameFactory(CARD_TYPES.ACE)
      const player = new Player()
      game.addPlayer(player)
      game.startRound()
  
      game.takeTurn(TURNS.INSURANCE)
  
      expect(player.getCurrentHand().getIsInsured()).toBe(true)
    })
  })

  it('cannot end round if it is still active', () => {
    const game = riggedGameFactory(CARD_TYPES.ACE)
    game.addPlayer(new Player())
    game.startRound()

    expect(() => game.endRound()).toThrowError('cannot end round')
  })
  
  it('ends round', () => {
    const game = riggedGameFactory(CARD_TYPES.ACE)
    game.endRound()
    
    expect(game.activeRound).toBe(null)
    expect(game.getActivePlayer()).toBe(null)
    expect(game.pastRounds.length).toBe(1)
  })
})