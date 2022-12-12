import express from 'express'
import route from './routes.js'
import cors from 'cors'

const app = express()
app.use(cors())
route(app)

app.listen(8080, () => {
  console.log('app is listening on port 8080')
})