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
  defaultLayout: 'main',
  helpers: {
    eq: function (v1, v2) { return v1 === v2 }
  }
}))
app.set('view engine', 'hbs')

app.use((req, res, next) => {
  res.locals.freeway = req.query.freeway
  res.locals.section = req.query.section
  next()
})

app.get('/', (req, res) => {
  res.render('index', { freewayLists })
})

app.get('/sections/traffic', async (req, res) => {
  console.log('@@@@@@@我是/sections/traffic')
  const [sectionID, sectionName] = req.query.section.split(',')

  try {
    let trafficInformation = ''
    let travelSpeed = ''
    let travelTime = ''

    const data = await axios.get(`https://traffic.transportdata.tw/MOTC/v2/Road/Traffic/Live/Freeway/${sectionID}?$top=30&$format=JSON`, {
      headers: GetAuthorizationHeader()
    })

    fs.appendFile('./logs/res.txt', JSON.stringify(data.data) + '\n', err => {
      if (err) console.error(err)
    })

    trafficInformation = data.data
    travelSpeed = trafficInformation.LiveTraffics[0].TravelSpeed
    travelTime = trafficInformation.LiveTraffics[0].TravelTime

    return res.render('index', {
      freewayLists,
      sectionName,
      travelTime,
      travelSpeed
    })

  } catch (error) {
    console.error(error)
  }

})

app.get('/sections', async (req, res) => {
  console.log('@@@@@@@我是/sections')

  const roadNameInUTF8 = encodeURI(req.query.freeway)

  try {
    // TODO：可以從API要起始位置資料
    const data = await axios.get(`https://traffic.transportdata.tw/MOTC/v2/Road/Traffic/Section/Freeway?$select=RoadName%2CSectionName%2CSectionID%20&$filter=contains(SectionName%2C'${roadNameInUTF8}')&$format=JSON`, {
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