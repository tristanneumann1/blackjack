import { Application, Request, Response } from 'express'
import GameController from './controllers/Game.controller.js'
import PlayerController from './controllers/Player.controller.js'
import { playerToDTO } from './DTO.js'

function route(app: Application): Application {
  const playerController = new PlayerController()
  const gameController = new GameController()
  /*
    ENTITY: PLAYER & ADMIN & ALL

    ALL
      create player

    PLAYER
      read player 
      update betSize
      add funds
      join game (creates one by default)
      start round
      end game
      Take turn (game)
      read current Hands
      read Round
      View running count
      * view history + stats *

    ADMIN
      -
  */
  app.use('/player')
  .post('/', (_: Request, res: Response) => {
    const player = playerController.create()
    res.send(JSON.stringify(playerToDTO(player)))
  })

  gameController
  // .get('/:id', playerAuth, (req: Request, res:Response))
  return app
}

export default route