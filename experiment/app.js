const _ = require('lodash')
const express = require('express')
const app = express()
const http = require('http').createServer(app)

app.use('/test', (req, res) => {
  res.set('ETag', 'blah')
  res.json(_.range(0, 10).map(() => Math.random()))
})

http.listen(process.env.PORT, () => console.log('listening on: %s', http.address().port))
