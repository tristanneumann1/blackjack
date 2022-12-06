import { TURNS } from '../enums.js';
import Round from './Round.js';

function buildSurrenderTable() {
  // map of when to surrender
  // result is true if surrender
  const surrenderTable = new Map()
  surrenderTable.set('16 9', true)
  surrenderTable.set('16 10', true)
  surrenderTable.set('16 1', true)
  surrenderTable.set('15 10', true)

  return surrenderTable
}

const SURRENDER_TABLE = buildSurrenderTable()

function buildSplitTable() {
  // map of when to split
  // result is true if split
  const splitTable = new Map()

  splitTable.set('2 2', true)
  splitTable.set('2 3', true)
  splitTable.set('2 4', true)
  splitTable.set('2 5', true)
  splitTable.set('2 6', true)
  splitTable.set('2 7', true)
  splitTable.set('2 8', true)
  splitTable.set('2 9', true)
  splitTable.set('2 10', true)
  splitTable.set('2 1', true)

  splitTable.set('18 2', true)
  splitTable.set('18 3', true)
  splitTable.set('18 4', true)
  splitTable.set('18 5', true)
  splitTable.set('18 6', true)
  splitTable.set('18 8', true)
  splitTable.set('18 9', true)
  
  splitTable.set('16 2', true)
  splitTable.set('16 3', true)
  splitTable.set('16 4', true)
  splitTable.set('16 5', true)
  splitTable.set('16 6', true)
  splitTable.set('16 7', true)
  splitTable.set('16 8', true)
  splitTable.set('16 9', true)
  splitTable.set('16 10', true)
  splitTable.set('16 1', true)
  
  splitTable.set('14 2', true)
  splitTable.set('14 3', true)
  splitTable.set('14 4', true)
  splitTable.set('14 5', true)
  splitTable.set('14 6', true)
  splitTable.set('14 7', true)
  
  splitTable.set('12 2', true)
  splitTable.set('12 3', true)
  splitTable.set('12 4', true)
  splitTable.set('12 5', true)
  splitTable.set('12 6', true)
  
  splitTable.set('8 5', true)
  splitTable.set('8 6', true)
  
  splitTable.set('6 2', true)
  splitTable.set('6 3', true)
  splitTable.set('6 4', true)
  splitTable.set('6 5', true)
  splitTable.set('6 6', true)
  splitTable.set('6 7', true)
  
  splitTable.set('4 2', true)
  splitTable.set('4 3', true)
  splitTable.set('4 4', true)
  splitTable.set('4 5', true)
  splitTable.set('4 6', true)
  splitTable.set('4 7', true)

  return splitTable
}

const SPLIT_TABLE = buildSplitTable()

function buildSoftTable() {
  const softTable = new Map()

  softTable.set('11 1', TURNS.STAND)
  softTable.set('11 10', TURNS.STAND)
  softTable.set('11 9', TURNS.STAND)
  softTable.set('11 8', TURNS.STAND)
  softTable.set('11 7', TURNS.STAND)
  softTable.set('11 6', TURNS.STAND)
  softTable.set('11 5', TURNS.STAND)
  softTable.set('11 4', TURNS.STAND)
  softTable.set('11 3', TURNS.STAND)
  softTable.set('11 2', TURNS.STAND)
  
  softTable.set('10 1', TURNS.STAND)
  softTable.set('10 10', TURNS.STAND)
  softTable.set('10 9', TURNS.STAND)
  softTable.set('10 8', TURNS.STAND)
  softTable.set('10 7', TURNS.STAND)
  softTable.set('10 6', TURNS.STAND)
  softTable.set('10 5', TURNS.STAND)
  softTable.set('10 4', TURNS.STAND)
  softTable.set('10 3', TURNS.STAND)
  softTable.set('10 2', TURNS.STAND)
  
  softTable.set('9 1', TURNS.STAND)
  softTable.set('9 10', TURNS.STAND)
  softTable.set('9 9', TURNS.STAND)
  softTable.set('9 8', TURNS.STAND)
  softTable.set('9 7', TURNS.STAND)
  softTable.set('9 6', TURNS.DOUBLE)
  softTable.set('9 5', TURNS.STAND)
  softTable.set('9 4', TURNS.STAND)
  softTable.set('9 3', TURNS.STAND)
  softTable.set('9 2', TURNS.STAND)

  softTable.set('8 8', TURNS.STAND)
  softTable.set('8 7', TURNS.STAND)
  softTable.set('8 6', TURNS.DOUBLE)
  softTable.set('8 5', TURNS.DOUBLE)
  softTable.set('8 4', TURNS.DOUBLE)
  softTable.set('8 3', TURNS.DOUBLE)
  softTable.set('8 2', TURNS.DOUBLE)
  
  softTable.set('7 6', TURNS.DOUBLE)
  softTable.set('7 5', TURNS.DOUBLE)
  softTable.set('7 4', TURNS.DOUBLE)
  softTable.set('7 3', TURNS.DOUBLE)
  
  softTable.set('6 6', TURNS.DOUBLE)
  softTable.set('6 5', TURNS.DOUBLE)
  softTable.set('6 4', TURNS.DOUBLE)

  softTable.set('5 6', TURNS.DOUBLE)
  softTable.set('5 5', TURNS.DOUBLE)
  softTable.set('5 4', TURNS.DOUBLE)
  
  softTable.set('4 6', TURNS.DOUBLE)
  softTable.set('4 5', TURNS.DOUBLE)

  softTable.set('3 6', TURNS.DOUBLE)
  softTable.set('3 5', TURNS.DOUBLE)

  return softTable
}

const SOFT_TABLE = buildSoftTable()

function buildHardTable() {
  const hardTable = new Map()

  for (let i = 1; i <= 10; i++) {
    hardTable.set(`20 ${i}`, TURNS.STAND)
    hardTable.set(`19 ${i}`, TURNS.STAND)
    hardTable.set(`18 ${i}`, TURNS.STAND)
    hardTable.set(`17 ${i}`, TURNS.STAND)
  }
  

  for (let i = 2; i <= 6; i++) {
    hardTable.set(`16 ${i}`, TURNS.STAND)
    hardTable.set(`15 ${i}`, TURNS.STAND)
    hardTable.set(`14 ${i}`, TURNS.STAND)
    hardTable.set(`13 ${i}`, TURNS.STAND)
  }
  
  hardTable.set('12 4', TURNS.STAND)
  hardTable.set('12 5', TURNS.STAND)
  hardTable.set('12 6', TURNS.STAND)
  
  for (let i = 1; i <= 10; i++) {
    hardTable.set(`11 ${i}`, TURNS.DOUBLE)
  }
  
  for (let i = 2; i <= 9; i++) {
    hardTable.set(`10 ${i}`, TURNS.DOUBLE)
  }
  
  for (let i = 3; i <= 6; i++) {
    hardTable.set(`9 ${i}`, TURNS.DOUBLE)
  }
  return hardTable
}

const HARD_TABLE = buildHardTable()

export default function checkMove(round: Round): TURNS {
  const hand = round.getActivePlayer().getCurrentHand()

  const roundDescriptor = round.getDescriptor()

  // SPLIT
  if (hand.getIsPair() && SPLIT_TABLE.get(roundDescriptor)) {
    return TURNS.SPLIT
  }

  // SURRENDER
  if (round.getActivePlayer().canSurrender() && SURRENDER_TABLE.get(roundDescriptor)) {
    return TURNS.SURRENDER
  }

  // SOFT
  if (hand.getHandValue().isSoft) {
    const result = SOFT_TABLE.get(roundDescriptor)

    if(result === TURNS.DOUBLE && !round.getActivePlayer().canDouble()) {
      if (hand.getHandValue().hardTotal >= 8) {
        return TURNS.STAND
      }
      return TURNS.HIT
    }
    return result?? TURNS.HIT
  }

  const result = HARD_TABLE.get(roundDescriptor)

  if(result === TURNS.DOUBLE && !round.getActivePlayer().canDouble()) {
    return TURNS.HIT
  }
  return HARD_TABLE.get(roundDescriptor)?? TURNS.HIT
}