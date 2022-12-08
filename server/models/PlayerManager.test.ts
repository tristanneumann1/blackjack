import Player from './Player.js'
import PlayerManager from './PlayerManager.js'

describe('player manager', () => {
  it('can add players', () => {
    const playerManager = new PlayerManager()
    playerManager.addPlayer(new Player())
    playerManager.addPlayer(new Player())

    expect(playerManager.size()).toBe(2)
  })
})