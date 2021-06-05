const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const axios = require('axios')
const fs = require('fs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { GetAuthorizationHeader } = require('./lib/auth')

const PORT = process.env.PORT

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/traffic', (req, res) => {
  async function getData() {
    try {
      const data = await axios.get('https://traffic.transportdata.tw/MOTC/v2/Road/Traffic/Live/News/Freeway?$top=1&$format=JSON?$top=30&$format=JSON', {
        headers: GetAuthorizationHeader()
      })

      fs.appendFile('./logs/res.txt', JSON.stringify(data.data) + '\n', err => {
        if (err) console.error(err)
      })

      console.log(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  getData()

  res.redirect('/')
})

app.listen(PORT, () => {
  console.log(`This website is running on https://localhost:${PORT}`)
})