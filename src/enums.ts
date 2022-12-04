export enum CARD_TYPES {
  TWO = 2,
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
  KING,
  ACE
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
  HIT,
  STAND,
  DOUBLE,
  SPLIT,
  SURRENDER,
  INSURANCE
}

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}