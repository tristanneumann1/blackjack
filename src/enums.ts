export enum CARD_TYPES {
  ACE = 1,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING
}

export enum CARD_SUITS {
  DIAMOND,
  CLUB,
  HEART,
  SPADE
}

export enum RESULTS {
  WIN,
  LOSE,
  PUSH,
  BLACK_JACK
}

export enum TURNS {
  HIT = 'HIT',
  STAND = 'STAND',
  DOUBLE = 'DOUBLE',
  SPLIT = 'SPLIT',
  SURRENDER = 'SURRENDER',
  INSURANCE = 'INSURANCE'
}

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}