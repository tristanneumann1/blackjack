import Hand from '../models/Hand.js'
import PlayerController from './Player.controller.js'

describe('player controller', () => {
  it('creates a new player controller', () => {
    const playerController = new PlayerController()
    expect(playerController).toBeInstanceOf(PlayerController)
  })

  it('returns null if no player exists', () => {
    const playerController = new PlayerController()

    expect(playerController.getById('missing player')).toBe(null)
  })

  it('can create a new player', () => {
    const playerController = new PlayerController()
    const player = playerController.create()

    expect(playerController.getAllPlayers().length).toBe(1)
    expect(playerController.getAllPlayers()[0]).toBe(player)
    expect(playerController.getById(player.id)).toBe(player)
  })

  it('throws error if trying to add funds to non existing player', () => {
    const playerController = new PlayerController()
    
    expect(() => playerController.addFunds('missing player', 100)).toThrowError('[Player Controller] cannot add funds, player does not exist')
  })

  it('adds funds to player', () => {
    const playerController = new PlayerController()
    const player = playerController.create()
    
    playerController.addFunds(player.id, 100)

    expect(player.funds).toBe(100)
  })

  it('throws error if trying to change betSize of non existing player', () => {
    const playerController = new PlayerController()
    
    expect(() => playerController.setBetSize('missing player', 100)).toThrowError('[Player Controller] cannot set bet size, player does not exist')
  })

  it('sets bet size of player', () => {
    const playerController = new PlayerController()
    const player = playerController.create()
    
    playerController.setBetSize(player.id, 100)

    expect(player.betSize).toBe(100)
  })

  it('throws an error when trying to read the hands of a player that does not exist', () => {
    const playerController = new PlayerController()

    expect(() => playerController.readHands('fake player')).toThrowError('[Player Controller] cannot read player hand, player does not exist')
  })

  it('can read player\'s hands', () => {
    const playerController = new PlayerController()
    const player = playerController.create()
    const hand = new Hand()
    player.dealHand(hand)

    expect(playerController.readHands(player.id)[0]).toBe(hand)
  })
})