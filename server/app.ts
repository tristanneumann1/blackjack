import express from 'express'
import route from './routes.js'

const app = express()

route(app)

app.listen(8080, () => {
  console.log('app is listening on port 8080')
})