import { playerWithFundsFactory } from '../../test/utils.js'
import { TURNS } from '../enums.js'
import Card from '../models/Card.js'
import Game from '../models/Game.js'
import Player from '../models/Player.js'
import Round from '../models/Round.js'
import GameController from './Game.controller.js'

describe('game controller', () => {
  it('can be initiated', () => {
    const gameController = new GameController()
    expect(gameController).toBeInstanceOf(GameController)
    expect(gameController.currentGame).toBe(null)
  })

  it('can add an initial player', () => {
    const gameController = new GameController()
    gameController.addPlayer(new Player())

    expect(gameController.currentGame).toBeInstanceOf(Game)
    expect(gameController.currentGame.activeRound).toBe(null)
    expect(gameController.currentGame.getActivePlayer()).toBe(null)
  })

  it('throws an error when trying to start a game when not all players can start', () => {
    const gameController = new GameController()

    gameController.addPlayer(playerWithFundsFactory(10, 100))
    
    expect(() => gameController.start()).toThrowError('[Game Controller] cannot start game, players do not have sufficient funds')
  })

  it('starts a round', () => {
    const gameController = new GameController()
    gameController.addPlayer(new Player())
    
    gameController.start()

    expect(gameController.currentGame.activeRound).toBeInstanceOf(Round)    
    expect(gameController.currentGame.activeRound.active).toBe(true)    
  })

  it('can end a game if one in progress', () => {
    const gameController = new GameController()
    gameController.addPlayer(new Player())
    
    gameController.endGame()

    expect(gameController.currentGame).toBe(null)
  })

  it('throws an error if taking a turn but no game in progress', () => {
    const gameController = new GameController()
    expect(() => gameController.takeTurn(new Player(), TURNS.STAND)).toThrowError('[Game Controller] can not take turn, no game in progress')
  })

  it('can take a turn', () => {
    const gameController = new GameController()
    const player = new Player()
    gameController.addPlayer(player)
    
    gameController.start()
    gameController.takeTurn(player, TURNS.STAND)

    expect(gameController.currentGame.getActivePlayer()).toBe(null)
  })

  it('throws an error if reading house hand but no game in progress', () => {
    const gameController = new GameController()
    expect(() => gameController.viewHouse()).toThrowError('[Game Controller] can not read house, no game in progress')
  })

  it('can get house view', () => {
    const gameController = new GameController()
    gameController.addPlayer(new Player())
    gameController.start()

    expect(gameController.viewHouse().length).toBe(2)
    expect(gameController.viewHouse()[0]).toBeInstanceOf(Card)
    expect(gameController.viewHouse()[1]).toBeNull()
  })
})