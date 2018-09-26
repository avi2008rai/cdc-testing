const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Repository = require('./repository')

const server = express()
server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
  extended: true
}))
server.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')
  next()
})

const accountRepository = new Repository()

// Load default data into a repository
const importData = () => {
  const data = require('./data/accountData.json')
  data.reduce((a, v) => {
    v.id = a + 1
    accountRepository.insert(v)
    return a + 1
  }, 0)
}

// List all accounts with 'available' eligibility
const availableAccounts= () => {
  return accountRepository.fetchAll().filter(a => {
    return a.eligibility.available
  })
}

// Get all accounts
server.get('/accounts', (req, res) => {
  res.json(accountRepository.fetchAll())
})

// Get all available accounts
server.get('/accounts/available', (req, res) => {
  res.json(availableAccounts())
})

// Find an account by ID
server.get('/accounts/:id', (req, res) => {
  const response = accountRepository.getById(req.params.id)
  if (response) {
    res.end(JSON.stringify(response))
  } else {
    res.writeHead(404)
    res.end()
  }
})

// Register a new account for the service
server.post('/accounts', (req, res) => {
  const account = req.body

  // Really basic validation
  if (!account || !account.first_name) {
    res.writeHead(400)
    res.end()

    return
  }

  account.id = accountRepository.fetchAll().length
  accountRepository.insert(account)

  res.writeHead(200)
  res.end()
})

module.exports = {
  server,
  importData,
  accountRepository
}
