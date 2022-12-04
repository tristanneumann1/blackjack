import { CARD_SUITS, CARD_TYPES, enumKeys } from '../enums.js'
import Card from './Card.js'

class Shoe {
  private cards: Card[] = []
  private discardedCards: Card[] = []
  
  fill(deckAmount = 4): void {
    this.emptyShoe()
    for (let i = 0; i < deckAmount; i++) {
      this.addDeck()
    }
    this.shuffle()
  }

  getSize(): number {
    return this.cards.length
  }

  emptyShoe(): void {
    this.cards = []
  }

  draw(number = 1): Card[] {
    if (number > this.cards.length) {
      throw new Error('no cards can be drawn')
    }
    const drawnCards: Card[] = []
    for (let n = 0; n < number; n++) {
      const drawnCard = this.cards.pop()
      drawnCards.push(drawnCard)
      this.discardedCards.push(drawnCard)
    }
    return drawnCards
  }

  take(card: Card) {
    this.cards.push(card)
  }

  private addDeck(): void {
    for (const cardType of enumKeys(CARD_TYPES)) {
      for (const cardSuit of enumKeys(CARD_SUITS)) {
        this.cards.push(new Card(CARD_TYPES[cardType], CARD_SUITS[cardSuit]))
      }
    }
  }
  
  private shuffle(): void {
    for (let i = 0; i < this.cards.length; i++) {
      const swapIndex = Math.floor(Math.random() * this.cards.length);
      [this.cards[i], this.cards[swapIndex]] = [this.cards[swapIndex], this.cards[i]]
    }
  }
}

export default Shoe
