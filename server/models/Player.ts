import Hand from './Hand.js'
import { v4 } from 'uuid'
import { RESULTS } from '../enums.js'

export default class Player {
  private hands: Hand[] = []
  id: string = v4()
  funds = 0
  betSize = 0
  private handIndex = 0

  canDeal(): boolean {
    return this.funds >= this.betSize
  }

  dealHand(hand): void {
    if (this.funds < this.betSize) {
      throw new Error('insufficient funds')
    }
    hand.setBet(this.betSize)
    this.funds -= this.betSize
    this.hands.push(hand)
  }
  
  addFunds(amount: number) {
    this.funds += amount
  }

  setBetSize(amount: number) {
    if (amount < 0 || !Number.isInteger(amount)) {
      throw new Error('invalid bet size')
    }
    this.betSize = amount
  }

  activeHands() :Hand[] {
    return this.hands.filter(hand => hand.getActive())
  }

  readHands() :Hand[] {
    return this.hands
  }

  getCurrentHand() : Hand | null {
    return this.hands[this.handIndex] || null
  }

  changeHand() {
    this.handIndex++
  }

  canHit(): boolean {
    return this.getCurrentHand() ? !this.getCurrentHand().isBusted() : false
  }

  canDouble(): boolean {
    // TODO include not doubling split aces
    if (this.funds < this.betSize) {
      return false
    }
    return this.getCurrentHand()?.getHandSize() <= 2 || false
  }

  double() {
    this.funds -= this.getCurrentHand().getBet()
    this.getCurrentHand().double()
  }

  canSplit(): boolean {
    if (this.funds < this.betSize) {
      return false
    }
    const hand = this.getCurrentHand()
    return hand.getIsPair()
  }

  canSurrender(): boolean {
    return this.getCurrentHand()?.getHandSize() <= 2 || false
  }

  canInsure(): boolean {
    if (this.funds < this.betSize) {
      return false
    }
    return this.getCurrentHand()?.getHandSize() <= 2 || false
  }

  insure() {
    this.funds -= this.betSize
    this.getCurrentHand().insure()
  }

  payOut() {
    this.activeHands().forEach(hand => {
      hand.disactivate()
      const bet = hand.getBet()
      let reward = 0

      if(hand.getHouseBlackJacked() && hand.getIsInsured()) {
        this.addFunds(Math.floor(bet * 2))
      }

      if (hand.getIsSurrendered()) {
        this.addFunds(Math.floor(bet / 2))
        return
      }

      switch (hand.getResult()) {
        case RESULTS.LOSE:
          break
        case RESULTS.PUSH:
          this.addFunds(bet)
          break
        case RESULTS.WIN:
          this.addFunds(bet)
          reward = bet
          break
        case RESULTS.BLACK_JACK:
          this.addFunds(bet)
          reward = Math.floor(bet * 3 / 2)
          break
      }

      this.addFunds(reward)
    })
  }
}