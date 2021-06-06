const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const axios = require('axios')
const fs = require('fs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { GetAuthorizationHeader } = require('./lib/auth')
const freewayLists = require('./public/json/freewayList.json')

const PORT = process.env.PORT

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index', { freewayLists })
})

app.get('/sections/traffic', async (req, res) => {
  try {
    let trafficInformation = ''

    const data = await axios.get('https://traffic.transportdata.tw/MOTC/v2/Road/Traffic/Section/Freeway?$select=SectionName%2C%20SectionMile&$format=JSON', {
      headers: GetAuthorizationHeader()
    })

    fs.appendFile('./logs/res.txt', JSON.stringify(data.data) + '\n', err => {
      if (err) console.error(err)
    })

    trafficInformation = data.data


    res.render('index', { freewayLists })

  } catch (error) {
    console.error(error)
  }

})

app.get('/sections', async (req, res) => {
  const roadNameInUTF8 = encodeURI(req.query.freeway)

  try {
    // TODO：可以從API要起始位置資料
    const data = await axios.get(`https://traffic.transportdata.tw/MOTC/v2/Road/Traffic/Section/Freeway?$select=RoadName%2CSectionName%20&$filter=contains(RoadName%2C'${roadNameInUTF8}')&$format=JSON`, {
      headers: GetAuthorizationHeader()
    })

    const sectionLists = data.data.Sections
    res.render('index', { freewayLists, sectionLists })

  } catch (error) {
    console.error(error)
  }
})

app.listen(PORT, () => {
  console.log(`This website is running on https://localhost:${PORT}`)
})