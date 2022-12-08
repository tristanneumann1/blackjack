import { TURNS } from '../enums.js'
import Card from '../models/Card.js'
import Game from '../models/Game.js'
import Player from '../models/Player.js'

export default class GameController {
  currentGame: Game = null
  addPlayer(player: Player) {
    if (!this.currentGame) {
      this.currentGame = new Game()
    }
    this.currentGame.addPlayer(player)
  }

  start() {
    try {
      this.currentGame?.startRound()
    } catch(e) {
      this.throw('cannot start game, ' + e.message)
    }
  }

  viewHouse(): Card[] {
    if (!this.currentGame) {
      this.throw('can not read house, no game in progress')
    }
    return this.currentGame.activeRound.houseView()
  }

  takeTurn(turn: TURNS) {
    if (!this.currentGame) {
      this.throw('can not take turn, no game in progress')
    }
    this.currentGame.takeTurn(turn)
  }

  endGame() {
    this.currentGame = null
  }

  private throw (message: string) {
    throw new Error('[Game Controller] ' + message)
  }
}