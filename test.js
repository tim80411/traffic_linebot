const fs = require('fs')
let list = require('./public/json/section.json')

list = list.Sections

list = list.map(list => {
  const freewayName = list.SectionName.split('(')
  list.SectionName = freewayName[0]
  // list.SectionMile.StartKM = transferKStringToNumstring(list.SectionMile.StartKM)

  return list.SectionName
}).filter((list, i, arr) => arr.indexOf(list) === i)
  .map(list => {
    const newObj = {
      name: list,
      // StartKM: StartKM
    }

    return newObj
  })

console.log(list)

fs.appendFile('./logs/res.txt', JSON.stringify(list) + '\n', err => {
  if (err) console.error(err)
})

function transferKStringToNumstring(KString) {
  let numString = ''

  numString = KString.split('+')

  numString = numString[0].replace('K', '') + numString[1]

  return numString
}