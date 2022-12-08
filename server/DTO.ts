import Player from './models/Player.js';

interface PlayerDTO {
  id: string,
  funds: number,
  betSize: number
}

export function playerToDTO(player: Player): PlayerDTO {
  return {
    id: player.id,
    funds: player.funds,
    betSize: player.betSize
  }
}