import { CARD_SUITS, CARD_TYPES } from '../src/enums.js';
import { HandValue } from '../src/interfaces.js';
import Card from '../src/models/Card.js';
import Game from '../src/models/Game.js';
import Hand from '../src/models/Hand.js';
import Player from '../src/models/Player.js';
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

interface RiggedGameFactoryOptions {
  type?: CARD_TYPES,
  cards?: CARD_TYPES[]
}

export function riggedGameFactory(options: RiggedGameFactoryOptions = {}) {
  const cards: CARD_TYPES[] = options.cards?? Array(15).fill(options.type)
  return new RiggedGame(
    cards.map(value => {
        return new Card(value, CARD_SUITS.CLUB);
      })
  );
}

export function playerWithFundsFactory(funds: number, betSize = 0): Player {
  const player = new Player()
  player.addFunds(funds)
  player.setBetSize(betSize)
  return player
}

export function handFactory(...cardTypes: CARD_TYPES[]): Hand {
  if(!cardTypes.length) {
    cardTypes = [CARD_TYPES.TEN, CARD_TYPES.TEN]
  }
  return new Hand({
    cards: cardTypes.map(type => {
      return new Card(type, CARD_SUITS.CLUB)
    })
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handValueFactory(options: any = {}): HandValue {
  return {
    hardTotal: options.hardTotal || 17,
    softTotal: options.softTotal || 17,
    isSoft: options.isSoft || false,
    isBlackJack: options.isBlackJack || false
  }
}