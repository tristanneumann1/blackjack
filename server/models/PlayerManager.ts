import Player from './Player.js';
import Round from './Round.js';

export default class PlayerManager {
  players: Player[] = []

  addPlayer(player: Player) {
    this.players.push(player)
  }

  size(): number {
    return this.players.length
  }

  includes(player: Player): boolean {
    return this.players.includes(player)
  }

  playersCanStart() {
    return this.players.length !== 0 && !this.players.find(player => !player.canDeal())
  }

  addToRound(round: Round) {
    this.players.forEach(round.addPlayer.bind(round))
  }
}