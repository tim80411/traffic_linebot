const jsSHA = require('jssha')

module.exports = {
  GetAuthorizationHeader() {
    const AppID = process.env.AppID
    const AppKey = process.env.AppKey

    let GMTString = new Date().toGMTString()
    let ShaObj = new jsSHA('SHA-1', 'TEXT')
    ShaObj.setHMACKey(AppKey, 'TEXT')
    ShaObj.update('x-date: ' + GMTString)
    let HMAC = ShaObj.getHMAC('B64')
    let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"'

    return { 'Authorization': Authorization, 'X-Date': GMTString, 'Accept-Encoding': 'gzip' } //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
  }
}