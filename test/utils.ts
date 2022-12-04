import { CARD_SUITS, CARD_TYPES } from '../src/enums.js';
import Card from '../src/models/Card.js';
import Game from '../src/models/Game.js';
import Shoe from '../src/models/Shoe.js';

interface FillShoeOptions {
  type?: CARD_TYPES,
  cards?: Card[]
}

export function getFilledShoe(options: FillShoeOptions = {}): Shoe {
  const shoe = new Shoe();
  if (options.cards) {
    options.cards.forEach(shoe.take.bind(shoe))
    return shoe
  }

  if (options.type) {
    Array(15).fill(options.type).forEach(type => shoe.take(new Card(type, CARD_SUITS.CLUB)));
    return shoe;
  }

  shoe.fill();
  return shoe;
}

export class RiggedGame extends Game {
  riggedCards: Card[] = [];

  constructor(cards: Card[]) {
    super();
    this.riggedCards = cards;
  }
  protected fillShoe() {
    this.riggedCards.forEach(this.shoe.take.bind(this.shoe));
  }
}

export function riggedGameFactory(type: CARD_TYPES) {
  return new RiggedGame(
    Array(15)
      .fill(type)
      .map(value => {
        return new Card(value, CARD_SUITS.CLUB);
      })
  );
}
