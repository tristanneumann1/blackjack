import { handFactory, playerWithHand, roundFactory } from '../../test/utils.js'
import { TURNS } from '../enums.js'
import checkMove from './MoveChecker.js'

describe('Move Checker', () => {
  it('surrenders when necessary', () => {
    const sixteenPlayer = playerWithHand(10, 6)
    const fifteenPlayer = playerWithHand(10, 5)

    const houseHandNine = handFactory(9)
    const houseHandTen = handFactory(10)
    const houseHandAce = handFactory(1)

    const round16_9 = roundFactory(houseHandNine, sixteenPlayer)
    const round16_10 = roundFactory(houseHandTen, sixteenPlayer)
    const round16_1 = roundFactory(houseHandAce, sixteenPlayer)
    const round15_10 = roundFactory(houseHandTen, fifteenPlayer)

    expect(checkMove(round16_9)).toBe(TURNS.SURRENDER)
    expect(checkMove(round16_10)).toBe(TURNS.SURRENDER)
    expect(checkMove(round16_1)).toBe(TURNS.SURRENDER)
    expect(checkMove(round15_10)).toBe(TURNS.SURRENDER)
  })

  describe('splitting', () => {
    const twosPlayer = playerWithHand(2, 2)
    const threesPlayer = playerWithHand(3, 3)
    const foursPlayer = playerWithHand(4, 4)
    const sixesPlayer = playerWithHand(6, 6)
    const sevensPlayer = playerWithHand(7, 7)
    const eightsPlayer = playerWithHand(8, 8)
    const ninesPlayer = playerWithHand(9, 9)
    const acesPlayer = playerWithHand(1, 1)

    for (let houseUpCard = 2; houseUpCard <= 7; houseUpCard++) {
      it(`splits 2s 3s and 7s on house ${houseUpCard}`, () => {
        const houseHand = handFactory(houseUpCard)
        const twosRound = roundFactory(houseHand, twosPlayer)
        const threesRound = roundFactory(houseHand, threesPlayer)
        const sevensRound = roundFactory(houseHand, sevensPlayer)

        expect(checkMove(twosRound)).toBe(TURNS.SPLIT)
        expect(checkMove(threesRound)).toBe(TURNS.SPLIT)
        expect(checkMove(sevensRound)).toBe(TURNS.SPLIT)
      })
    }
    

    it(`splits 4s on house 5 or 6`, () => {
      const houseHandFive = handFactory(5)
      const houseHandSix = handFactory(6)
      const houseFiveRound = roundFactory(houseHandFive, foursPlayer)
      const houseSixRound = roundFactory(houseHandSix, foursPlayer)

      expect(checkMove(houseFiveRound)).toBe(TURNS.SPLIT)
      expect(checkMove(houseSixRound)).toBe(TURNS.SPLIT)
    })
    
    it(`splits 6s up to 6`, () => {
      for (let houseUpCard = 2; houseUpCard <= 6; houseUpCard++) {
        const houseHand = handFactory(houseUpCard)
        const sixesRound = roundFactory(houseHand, sixesPlayer)

        expect(checkMove(sixesRound)).toBe(TURNS.SPLIT)
      }
    })

    it(`always splits 8s and As`, () => {
      for (let houseUpCard = 1; houseUpCard <= 10; houseUpCard++) {
        const houseHand = handFactory(houseUpCard)
        const eightsRound = roundFactory(houseHand, eightsPlayer)
        const acesRound = roundFactory(houseHand, acesPlayer)

        expect(checkMove(eightsRound)).toBe(TURNS.SPLIT)
        expect(checkMove(acesRound)).toBe(TURNS.SPLIT)
      }
    })

    for (let houseUpCard = 2; houseUpCard <= 9; houseUpCard++) {
      if (houseUpCard === 7) {
        continue
      }
      it(`splits 9s on ${houseUpCard}`, () => {
        const houseHand = handFactory(houseUpCard)
        const round = roundFactory(houseHand, ninesPlayer)

        expect(checkMove(round)).toBe(TURNS.SPLIT)
      })
    }
  })

  describe('soft totals', () => {
    it('always stands on soft 10 and 11', () => {
      for (let houseUpCard = 1; houseUpCard <= 10; houseUpCard++) {
        const houseHand = handFactory(houseUpCard)
        const round9 = roundFactory(houseHand, playerWithHand(1, 9))
        const round10 = roundFactory(houseHand, playerWithHand(1, 10))

        expect(checkMove(round9)).toBe(TURNS.STAND)
        expect(checkMove(round10)).toBe(TURNS.STAND)
      }
    })

    it('Doubles on soft 9 -- 6 otherwise stand', () => {
      for (let houseUpCard = 1; houseUpCard <= 10; houseUpCard++) {
        const houseHand = handFactory(houseUpCard)
        const round = roundFactory(houseHand, playerWithHand(1, 8))

        if (houseUpCard === 6) {
          expect(checkMove(round)).toBe(TURNS.DOUBLE)
        } else {
          expect(checkMove(round)).toBe(TURNS.STAND)
        }
      }
    })
    
    it('Doubles on soft 8 until 6', () => {
      for (let houseUpCard = 2; houseUpCard <= 6; houseUpCard++) {
        const houseHand = handFactory(houseUpCard)
        const round = roundFactory(houseHand, playerWithHand(1, 7))

        expect(checkMove(round)).toBe(TURNS.DOUBLE)
      }
    })

    it('Stands if it is meant to double but cannot and hard total >= 8', () => {
      const houseHand = handFactory(6)
      const round = roundFactory(houseHand, playerWithHand(1, 5, 3))
      
      expect(checkMove(round)).toBe(TURNS.STAND)
    })
    
    it('Stands on soft 8 on 7 and 8', () => {
      const houseHand7 = handFactory(7)
      const houseHand8 = handFactory(8)
      const roundHouse7 = roundFactory(houseHand7, playerWithHand(1, 7))
      const roundHouse8 = roundFactory(houseHand8, playerWithHand(1, 7))

      expect(checkMove(roundHouse7)).toBe(TURNS.STAND)
      expect(checkMove(roundHouse8)).toBe(TURNS.STAND)
    })
    
    for (let secondCard = 2; secondCard <= 6; secondCard++) {
      it(`always doubles ${secondCard} on a 5 or 6`, () => {
        const houseHand5 = handFactory(5)
        const houseHand6 = handFactory(6)
        const roundHouse5 = roundFactory(houseHand5, playerWithHand(1, secondCard))
        const roundHouse6 = roundFactory(houseHand6, playerWithHand(1, secondCard))
        
        expect(checkMove(roundHouse5)).toBe(TURNS.DOUBLE)
        expect(checkMove(roundHouse6)).toBe(TURNS.DOUBLE)
      })
    }
    
    for (let secondCard = 4; secondCard <= 6; secondCard++) {
      it(`always doubles ${secondCard} on a 4`, () => {
        const houseHand = handFactory(4)
        const round = roundFactory(houseHand, playerWithHand(1, secondCard))
        
        expect(checkMove(round)).toBe(TURNS.DOUBLE)
      })
    }
    it('doubles a soft 7 on a 3', () => {
      const houseHand = handFactory(3)
      const round = roundFactory(houseHand, playerWithHand(1, 6))
      
      expect(checkMove(round)).toBe(TURNS.DOUBLE)
    })

    it('hits if it is meant to double but cannot and hard total <= 7', () => {
      const houseHand = handFactory(3)
      const round = roundFactory(houseHand, playerWithHand(1, 4, 2))
      
      expect(checkMove(round)).toBe(TURNS.HIT)
    })
  })

  describe('hard totals', () => {
    for(let unit = 7; unit <= 10; unit++) {
      it(`always stands on a hard ${10 + unit}`, () => {
        for (let houseUpCard = 1; houseUpCard <= 10; houseUpCard++) {
          const houseHand = handFactory(houseUpCard)
          const round = roundFactory(houseHand, playerWithHand(10, unit))
  
          expect(checkMove(round)).toBe(TURNS.STAND)
        }
      })
    }

    for(let unit = 3; unit <= 6; unit++) {
      it(`always stands on a hard ${10 + unit} when dealer card < 7`, () => {
        for (let houseUpCard = 2; houseUpCard < 7; houseUpCard++) {
          const houseHand = handFactory(houseUpCard)
          const round = roundFactory(houseHand, playerWithHand(10, unit))
  
          expect(checkMove(round)).toBe(TURNS.STAND)
        }
      })
    }
    it('stands a hard 12 on a dealer 4, 5 or 6', () => {
      const houseHand4 = handFactory(4)
      const houseHand5 = handFactory(5)
      const houseHand6 = handFactory(6)
      const roundHouse4 = roundFactory(houseHand4, playerWithHand(10, 2))
      const roundHouse5 = roundFactory(houseHand5, playerWithHand(10, 2))
      const roundHouse6 = roundFactory(houseHand6, playerWithHand(10, 2))

      expect(checkMove(roundHouse4)).toBe(TURNS.STAND)
      expect(checkMove(roundHouse5)).toBe(TURNS.STAND)
      expect(checkMove(roundHouse6)).toBe(TURNS.STAND)
    })

    it('always doubles a hard 11', () => {
      for (let houseUpCard = 1; houseUpCard <= 11; houseUpCard++) {
        const houseHand = handFactory(houseUpCard)
        const round = roundFactory(houseHand, playerWithHand(5, 6))

        expect(checkMove(round)).toBe(TURNS.DOUBLE)
      }
    })
    
    it('doubles a hard 10 when house has less then 10', () => {
      for (let houseUpCard = 2; houseUpCard < 10; houseUpCard++) {
        const houseHand = handFactory(houseUpCard)
        const round = roundFactory(houseHand, playerWithHand(4, 6))

        expect(checkMove(round)).toBe(TURNS.DOUBLE)
      }
    })
    
    it('doubles a hard 9 when house has 3, 4, 5 or 6', () => {
      for (let houseUpCard = 3; houseUpCard <= 6; houseUpCard++) {
        const houseHand = handFactory(houseUpCard)
        const round = roundFactory(houseHand, playerWithHand(4, 5))

        expect(checkMove(round)).toBe(TURNS.DOUBLE)
      }
    })

    it('will hit when doubling is not permitted', () => {
      const round = roundFactory(handFactory(10), playerWithHand(4, 4, 3))

      expect(checkMove(round)).toBe(TURNS.HIT)
    })

    it('behaves as usual if cannot surrender on a surrender total', () => {
      const round = roundFactory(handFactory(10), playerWithHand(4, 4, 8))

      expect(checkMove(round)).toBe(TURNS.HIT)
    })
  })
})