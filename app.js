const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const PORT = 3000

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(PORT, () => {
  console.log(`This website is running on https://localhost:${PORT}`)
})