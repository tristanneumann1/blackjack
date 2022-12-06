import { CARD_SUITS, CARD_TYPES } from '../src/enums.js';
import { HandValue } from '../src/interfaces.js';
import Card from '../src/models/Card.js';
import Game from '../src/models/Game.js';
import Hand from '../src/models/Hand.js';
import Player from '../src/models/Player.js';
import Round from '../src/models/Round.js';
import Shoe from '../src/models/Shoe.js';


// ------------------ SHOE ------------------ //

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

// ------------------ GAME ------------------ //

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

// ------------------ PLAYER ------------------ //

export function playerWithFundsFactory(funds: number, betSize = 0): Player {
  const player = new Player()
  player.addFunds(funds)
  player.setBetSize(betSize)
  return player
}

export function playerWithHand(...cardTypes: CARD_TYPES[]): Player {
  const player = new Player()
  const hand = handFactory(...cardTypes)
  player.dealHand(hand)
  return player
}

// ------------------ HAND ------------------ //

export function handFactory(...cardTypes: number[]): Hand {
  if(!cardTypes.length) {
    cardTypes = [10, 10]
  }
  return new Hand({
    cards: cardTypes.map(type => {
      return new Card(CARD_TYPES[CARD_TYPES[type]], CARD_SUITS.CLUB)
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

// ------------------ ROUND ------------------ //

class RiggedRound extends Round {
  constructor () {
    super(getFilledShoe(), 'rigged-round-id')
    this.active = true
  }
  setHouse(hand: Hand) {
    this.house = hand
  }
}

export function roundFactory(house: Hand = null, player: Player = new Player()): Round {
  const round = new RiggedRound()
  round.addPlayer(player)
  if (house) {
    round.setHouse(house)
  }
  return round
}