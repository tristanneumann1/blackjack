import Hand from '../models/Hand.js'
import Player from '../models/Player.js'

export default class PlayerController {
  private players: Map<string, Player> = new Map()
  
  create(): Player {
    const player = new Player()
    this.players.set(player.id, player)
    return player
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values())
  }

  getById(id: string): Player {
    return this.players.get(id) || null
  }

  addFunds(id: string, amount: number) {
    const player = this.getById(id)
    if(!player) {
      this.throw('cannot add funds, player does not exist')
    }
    player.addFunds(amount)
  }

  setBetSize(id: string, betSize: number) {
    const player = this.getById(id)
    if(!player) {
      this.throw('cannot set bet size, player does not exist')
    }
    player.setBetSize(betSize)
  }

  readHands(id: string): Hand[] {
    const player = this.getById(id)
    if(!player) {
      this.throw('cannot read player hand, player does not exist')
    }
    return player.activeHands()
  }

  private throw(message: string): never {
    throw new Error('[Player Controller] ' + message)
  }
}