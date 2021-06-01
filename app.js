const express = require('express')
const app = express()

const PORT = 3000

app.get('/', (req, res) => {
  res.send('success')
})

app.listen(PORT, () => {
  console.log(`This website is running on https://localhost:${PORT}`)
})