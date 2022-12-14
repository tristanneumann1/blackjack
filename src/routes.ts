import express, { Application, Request, Response, Router } from 'express'
import GameController from './controllers/Game.controller.js'
import PlayerController from './controllers/Player.controller.js'
import { gameToDTO, playerToDTO } from './DTO.js'
import { TURNS } from './enums.js'
import { playerAuth } from './middleware.js'

function route(app: Application): Application {
  const playerController = new PlayerController()
  const gameController = new GameController()
  const gameRouter = Router() 
  const playerRouter = Router()
  const authedPlayerRouter = Router({ mergeParams: true })

  playerRouter.post('/', (_: Request, res: Response) => {
    const player = playerController.create()
    res.send(playerToDTO(player))
  })

  authedPlayerRouter.get('/', (req: Request, res: Response) => {
    const playerId = req.params.playerId
    const player = playerController.getById(playerId)
    
    if(!player) {
      res.status(404).send('Could not find player')
      return
    }
    res.status(200).send(playerToDTO(player))
  })
  authedPlayerRouter.post('/add-funds', express.json(), (req: Request, res: Response) => {
    const playerId = req.params.playerId
    const amount = req.body.funds

    try {
      playerController.addFunds(playerId, amount)
      res.status(200).send(playerToDTO(playerController.getById(playerId)))
    } catch(e) {
      res.status(400).send(e.message)
      return
    }
  })
  authedPlayerRouter.post('/set-bet-size', express.json(), (req: Request, res: Response) => {
    const playerId = req.params.playerId
    const amount = req.body.betSize

    try {
      playerController.setBetSize(playerId, amount)
      res.status(200).send(playerToDTO(playerController.getById(playerId)))
    } catch(e) {
      res.status(400).send(e.message)
      return
    }
  })
  authedPlayerRouter.post('/join-game', (req: Request, res: Response) => {
    const playerId = req.params.playerId
    const player = playerController.getById(playerId)

    if (!player) {
      res.status(400).send('could not find player')
      return
    }

    gameController.addPlayer(player)
    // gameController.start()
    res.status(200).send(gameToDTO(gameController.currentGame))
  })
  authedPlayerRouter.post('/take-turn/:turn', (req: Request, res: Response) => {
    const playerId = req.params.playerId
    const player = playerController.getById(playerId)
    const turn = TURNS[req.params.turn]

    try {
      gameController.takeTurn(player, turn)
      res.status(200).send(gameToDTO(gameController.currentGame))
    } catch(e) {
      res.status(400).send(e.message)
    }
  })
  
  gameRouter.get('/', (_: Request, res: Response) => {
    if (!gameController.currentGame) {
      res.status(200).send(null)
    }
    res.status(200).send(gameToDTO(gameController.currentGame))
  })

  gameRouter.post('/start-round', (_: Request, res: Response) => {
    try {
      gameController.start()
      res.status(200).send(gameToDTO(gameController.currentGame))
    } catch(e) {
      res.status(400).send(e.message)
    }
  })
  
  gameRouter.post('/end-game', (_: Request, res: Response) => {
    gameController.endGame()
    res.status(200).end()
  })

  playerRouter.use('/:playerId', playerAuth, authedPlayerRouter)
  app.use('/player', playerRouter)
  app.use('/game', gameRouter)
  return app
}

export default route