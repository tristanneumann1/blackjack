import { Request, Response, NextFunction } from 'express'

export function playerAuth(req: Request, res: Response, next: NextFunction) {
  authenticatePlayer(req, res, () => {
    authorizePlayer(req, res, next)
  })
}

export function authorizePlayer(req: Request, res: Response, next: NextFunction) {
  const playerId = req.get('Player-Id')
  const requestedPlayer: string = req.params.playerId || null
  if (playerId !== requestedPlayer) {
    res.status(403)
    res.end()
    return
  }
  next()
}

export function authenticatePlayer(req: Request, res: Response, next: NextFunction) {
  req.get('Auth-Token')
  res
  // eslint-disable-next-line no-constant-condition
  if (false) {
    res.status(401)
    res.end()
  }
  next()
}
