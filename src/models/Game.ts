import { TURNS } from '../enums.js';
import Hand from './Hand.js';
import Player from './Player.js';
import Round from './Round.js';
import Shoe from './Shoe.js';

export default class Game {
  activeRound: Round = null
  pastRounds: Round[] = []
  protected shoe: Shoe = new Shoe()
  private players: Player[] = []

  addPlayer(player: Player) {
    this.players.push(player)
  }

  startRound() {
    this.fillShoe()
    this.activeRound = new Round(this.shoe)
    this.players.forEach(this.activeRound.addPlayer.bind(this.activeRound))
    this.activeRound.start()
  }

  takeTurn(turn: TURNS) {
    if(!this.activeRound?.canTakeTurn()) {
      throw new Error('cannot take turn')
    }

    const activePlayer: Player = this.activeRound.getActivePlayer()
    const activeHand: Hand = activePlayer.getCurrentHand()

    switch (turn) {
      case TURNS.STAND:
        this.activeRound.endTurn()
        break
      
      case TURNS.HIT:
        if (!activePlayer.canHit()) {
          throw new Error('hand cannot be hit')
        }
        this.hit(activeHand);
        if (activeHand.isBusted()) {
          this.activeRound.endTurn()
        }
        break
      
      case TURNS.DOUBLE:
        if (!activePlayer.canDouble()) {
          throw new Error('cannot double after hitting')
        }
        activeHand.take(this.shoe.draw()[0])
        activePlayer.double()
        this.activeRound.endTurn()
        break
      
      case TURNS.SPLIT:
        if (!activePlayer.canSplit()) {
          throw new Error('cannot split hand')
        }
        activePlayer.dealHand(activeHand.split())
        this.hit(activeHand)
        break
      
      case TURNS.SURRENDER:
        if (!activePlayer.canSurrender()) {
          throw new Error('cannot surrender hand')
        }
        activeHand.surrender()
        this.activeRound.endTurn()
        break
      
      case TURNS.INSURANCE:
        if(!this.activeRound.canInsure() || !activePlayer.canInsure()) {
          throw new Error('cannot insure hand')
        }
        activeHand.insure()
        break
    }
  }

  endRound() {
    if (this.activeRound?.active) {
      throw new Error('cannot end round')
    }
    this.activeRound?.players.forEach(player => player.payOut())
    this.pastRounds.push(this.activeRound)
    this.activeRound = null
  }

  getActivePlayer(): Player {
    return this.activeRound?.getActivePlayer() || null
  }

  protected fillShoe() {
    this.shoe.fill()
  }

  private hit(currentHand: Hand) {
    currentHand.take(this.shoe.draw()[0]);
  }
}