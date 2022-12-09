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
    if(!this.currentGame) {
      this.currentGame = new Game()
    }
    try {
      this.currentGame.startRound()
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

  takeTurn(player: Player, turn: TURNS) {
    if (!this.currentGame) {
      this.throw('can not take turn, no game in progress')
    }
    if (this.currentGame.getActivePlayer() !== player) {
      this.throw('can not take turn, it is another player\'s turn')
    }
    try {
      this.currentGame.takeTurn(turn)
    } catch (e) {
      this.throw('can not take turn, ' + e.message)
    }
  }

  endGame() {
    this.currentGame = null
  }

  private throw (message: string) {
    throw new Error('[Game Controller] ' + message)
  }
}