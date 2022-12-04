import Hand from './Hand.js'
import { v4 } from 'uuid'

export default class Player {
  private hands: Hand[] = []
  id: string = v4()
  private handIndex = 0

  dealHand(hand = new Hand()): void {
    this.hands.push(hand)
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
    return this.getCurrentHand()?.active
  }

  canDouble(): boolean {
    // TODO include not doubling split aces
    return this.getCurrentHand()?.getHandSize() <= 2 || false
  }

  canSplit(): boolean {
    const hand = this.getCurrentHand()
    return hand.getIsPair()
  }

  canSurrender(): boolean {
    return this.getCurrentHand()?.getHandSize() <= 2 || false
  }

  canInsure(): boolean {
    return this.getCurrentHand()?.getHandSize() <= 2 || false
  }
}