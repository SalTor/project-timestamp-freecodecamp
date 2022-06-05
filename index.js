// index.js
// where your node app starts

// init project
var express = require('express')
var app = express()

const { isValid, isDate, format, toDate, parse, parseISO } = require('date-fns')
const { enUS } = require('date-fns/locale')

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors')
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

function formatDate(date) {
  const isDateStr = /^\d{4}-\d{2}-\d{2}$/.test(date)
  let converted

  try {
    if (isDate(date)) {
      converted = toDate(date)
    } else if (isDateStr) {
      converted = toDate(parse(date, 'yyyy-MM-dd', new Date()))
    } else if (/^\d+$/.test(date)) {
      converted = toDate(parseInt(date, 10))
    } else if (isDate(new Date(date))) {
      converted = toDate(new Date(date))
    }
  } catch (error) {
    console.log(error)
  }

  if (!isValid(converted)) {
    return { error: 'Invalid Date' }
  }

  return {
    unix: converted.getTime(),
    utc: format(
      parseISO(converted.toISOString()),
      'iii, d MMM yyyy HH:mm:ss'
    ).concat(' GMT'),
  }
}

app.get('/api/', (req, res) => {
  return res.json(formatDate(new Date()))
})

app.get('/api/:date', function (req, res) {
  return res.json(formatDate(req.params.date))
})

// listen for requests :)
var listener = app.listen('12345', function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
