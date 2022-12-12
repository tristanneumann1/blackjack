import request from 'supertest'
import express, { Application } from 'express'
import route from './routes.js'
import { GameDTO, PlayerDTO } from './DTO.js';
import seedrandom from 'seedrandom'

interface gameStartedReturn {
  player: PlayerDTO,
  game: GameDTO
}
async function startGame(app: Application): Promise<gameStartedReturn> {
  const playerCreated = await request(app).post('/player');
  const playerId: string = playerCreated.body.id
  await request(app).post('/player/' + playerId + '/join-game').set('Player-Id', playerId);

  const game = await request(app).post('/game/start-round')

  return {
    player: playerCreated.body,
    game: game.body
  }
}

describe('routes', () => {
  let app: Application
  beforeEach(() => {
    app = express();
    route(app)
  })

  describe('player routes', () => {
    it('can create a new player', async () => {
      const res = await request(app).post('/player');
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      
      const body: PlayerDTO = res.body;
      expect(body.id.length).toBe(36);
      expect(body.funds).toBe(0);
      expect(body.betSize).toBe(0);
    })
    
    it('throws an error if not authenticated', async () => {
      const res = await request(app).get('/player/player-id')
  
      expect(res.statusCode).toBe(403)
    })
  
    it('can find a player', async () => {
      const playerCreated = await request(app).post('/player');
      const playerId: string = playerCreated.body.id
      
      const res = await request(app).get('/player/' + playerId).set('Player-Id', playerId)
      
      expect(res.statusCode).toBe(200);
      const body: PlayerDTO = res.body;
      expect(body.id).toBe(playerId);
      expect(body.funds).toBe(0);
      expect(body.betSize).toBe(0);
    })
    
    it('returns a 400 if player does not exist', async () => {
      const resSetBetSize = await request(app)
      .post('/player/player-id/set-bet-size')
      .send({ betSize: 400 })
      .set('Player-Id', 'player-id')
  
      const resAddFunds = await request(app)
      .post('/player/player-id/add-funds')
      .send({ funds: 400 })
      .set('Player-Id', 'player-id')
      
      const resJoinGame = await request(app)
      .post('/player/player-id/join-game')
      .send({ funds: 400 })
      .set('Player-Id', 'player-id')
      
      expect(resSetBetSize.statusCode).toBe(400);
      expect(resAddFunds.statusCode).toBe(400);
      expect(resJoinGame.statusCode).toBe(400);
    })
  
    it('can add funds to a player', async () => {
      const playerCreated = await request(app).post('/player');
      const playerId: string = playerCreated.body.id
      
      const res = await request(app)
      .post('/player/' + playerId + '/add-funds')
      .send({funds: 400})
      .set('Player-Id', playerId)
      
      expect(res.statusCode).toBe(200);
      const body: PlayerDTO = res.body;
      expect(body.id).toBe(playerId);
      expect(body.funds).toBe(400);
    })
  
    it('can set player bet size', async () => {
      const playerCreated = await request(app).post('/player');
      const playerId: string = playerCreated.body.id
      
      const res = await request(app)
      .post('/player/' + playerId + '/set-bet-size')
      .send({ betSize: 400 })
      .set('Player-Id', playerId)
      
      expect(res.statusCode).toBe(200);
      const body: PlayerDTO = res.body;
      expect(body.id).toBe(playerId);
      expect(body.betSize).toBe(400);
    })

    it('can join a game', async () => {
      const playerCreated = await request(app).post('/player');
      const playerId: string = playerCreated.body.id
  
      const res = await request(app)
      .post('/player/' + playerId + '/join-game')
      .set('Player-Id', playerId)
  
      expect(res.statusCode).toBe(200);
      const game: GameDTO = res.body
      expect(game.activeRound).toBeNull()
    })
    
    it('throws error if can not take a turn', async () => {
      const res = await request(app)
      .post('/player/player-id/take-turn/DOUBLE')
      .set('Player-Id', 'player-id');

      expect(res.statusCode).toBe(400)
      expect(res.text).toBe('[Game Controller] can not take turn, no game in progress')
    })
    
    it('throws error if not current player\'s turn', async () => {
      await startGame(app)
      const res = await request(app)
      .post('/player/player-id/take-turn/DOUBLE')
      .set('Player-Id', 'player-id');

      expect(res.statusCode).toBe(400)
      expect(res.text).toBe('[Game Controller] can not take turn, it is another player\'s turn')
    })
    
    it('throws error if invalid turn type', async () => {
      const { player } = await startGame(app)
      const res = await request(app)
      .post(`/player/${player.id}/take-turn/INVALID`)
      .set('Player-Id', player.id);

      expect(res.statusCode).toBe(400)
      expect(res.text).toBe('[Game Controller] can not take turn, invalid turn type')
    })
    
    it('throws error if invalid turn', async () => {
      seedrandom('SEED || routes.test.ts', { global: true }) // remove randomness from test factors
      const { player, game } = await startGame(app)

      game
      const res = await request(app)
      .post(`/player/${player.id}/take-turn/SPLIT`)
      .set('Player-Id', player.id)

      expect(res.statusCode).toBe(400)
      expect(res.text).toBe('[Game Controller] can not take turn, cannot split hand')
    })

    it('can take a turn', async () => {
      const { player } = await startGame(app)
      const res = await request(app)
      .post(`/player/${player.id}/take-turn/STAND`)
      .set('Player-Id', player.id);

      expect(res.statusCode).toBe(200)
      const game: GameDTO = res.body
      expect(game.activeRound.houseView.length).toBeGreaterThanOrEqual(2)
      expect(game.activeRound.houseView[1].visible).toBe(true)
    })
  })

  describe('game routes', () => {
    it('returns a 400 if not enough players when starting a round', async () => {
      const res = await request(app)
      .post('/game/start-round')

      expect(res.statusCode).toBe(400)
      expect(res.text).toBe('[Game Controller] cannot start game, players do not have sufficient funds')
    })

    it('starts a game', async () => {
      const playerCreated = await request(app).post('/player');
      const playerId: string = playerCreated.body.id
      await request(app).post('/player/' + playerId + '/join-game').set('Player-Id', playerId);

      const res = await request(app)
      .post('/game/start-round')

      expect(res.statusCode).toBe(200)
      const game: GameDTO = res.body
      expect(game.activeRound).not.toBeNull()
      expect(game.activeRound.houseView.length).toBe(2)
      expect(game.activeRound.houseView[0].visible).toBe(true)
      expect(game.activeRound.houseView[1]).toStrictEqual({ visible: false })

      expect(game.activeRound.players.length).toBe(1)
      expect(game.activeRound.players[0].id).toBe(playerId)
      expect(game.activeRound.players[0].hands.length).toBe(1)
      expect(game.activeRound.players[0].hands[0].cards.length).toBe(2)
    })

    it('gets current game', async () => {
      const res = await request(app).get('/game')

      expect(res.statusCode).toBe(200)
      expect(res.body).toStrictEqual({})

      await startGame(app)
      const resWithGame = await request(app).get('/game')
      const game: GameDTO = resWithGame.body

      expect(game.activeRound).not.toBeNull()
      expect(game.activeRound.houseView.length).toBe(2)
      expect(game.activeRound.players.length).toBe(1)
      expect(game.activeRound.players[0].hands.length).toBe(1)
      expect(game.activeRound.players[0].hands[0].cards.length).toBe(2)
    })

    it('ends a game if one in progress', async () => {
      await startGame(app)
      const res = await request(app).post('/game/end-game')

      expect(res.statusCode).toBe(200)

      const gameRes = await request(app).get('/game');
      expect(gameRes.body).toStrictEqual({})
    })
  })
})