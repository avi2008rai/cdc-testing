const express = require('express')
const request = require('superagent')
const server = express()
const API_HOST = process.env.API_HOST || 'http://localhost:8081'

// Fetch accounts who are currently 'available' from the
// Account Service
const availableAccounts = () => {
  return request
    .get(`${API_HOST}/accounts/available`)
    .then(res => res.body,
      () => [])
}

// Find accounts by their ID from the account Service
const getAccountById = (id) => {
  return request
    .get(`${API_HOST}/accounts/${id}`)
    .then(res => res.body,
      () => null)
}

// Suggestions function:
// Given availability and sex etc. find available suitors,
// and give them a 'score'
const suggestion = mate => {
  const predicates = [
    ((candidate, account) => candidate.id !== account.id),
    ((candidate, account) => candidate.gender !== account.gender),
    ((candidate, account) => candidate.account === account.account)
  ]

  const weights = [
    ((candidate, account) => Math.abs(candidate.age - account.age))
  ]

  return availableAccounts().then(available => {
    const eligible = available.filter(a => !predicates.map(p => p(a, mate)).includes(false))

    return {
      suggestions: eligible.map(candidate => {
        const score = weights.reduce((acc, weight) => {
          return acc - weight(candidate, mate)
        }, 100)

        return {
          score,
          'account': candidate
        }
      })
    }
  })
}

// Suggestions API
server.get('/suggestions/:accountId', (req, res) => {
  if (!req.params.accountId) {
    res.writeHead(400)
    res.end()
  }

  request(`${API_HOST}/accounts/${req.params.accountId}`, (err, r) => {
    if (!err && r.statusCode === 200) {
      suggestion(r.body).then(suggestions => {
        res.json(suggestions)
      })
    } else if (r && r.statusCode === 404) {
      res.writeHead(404)
      res.end()
    } else {
      res.writeHead(500)
      res.end()
    }
  })
})

module.exports = {
  server,
  availableAccounts,
  suggestion,
    getAccountById
}
