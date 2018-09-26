const verifier = require('pact').Verifier
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)
const {
  server,
  importData,
  accountRepository
} = require('../provider.js')


server.get('/states', (req, res) => {
  res.json({
    "Matching Service": ['Has some accounts', 'Has no accounts', 'Has an account with ID 1']
  })
})

server.post('/setup', (req, res) => {
  const state = req.body.state

  accountRepository.clear()
  switch (state) {
    case 'Has no account':
      // do nothing
      break
    default:
      importData()
  }

  res.end()
})

server.listen(8081, () => {
  console.log('Service listening on http://localhost:8081')
})

// Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
  it('should validate the expectations of Matching Service', function() { // lexical binding required here
    this.timeout(40000)

    let opts = {
      providerBaseUrl: 'http://localhost:8081',
      providerStatesUrl: 'http://localhost:8081/states',
      providerStatesSetupUrl: 'http://localhost:8081/setup',
      // Remote pacts
      pactUrls: ['https://sapient.pact.dius.com.au/pacts/provider/new-provider-services/consumer/new-consumer-services/latest'],
      // Local pacts
      // pactUrls: [path.resolve(process.cwd(), './pacts/consumer-services-new-provider-services-new.json')],
      pactBrokerUsername: 'nW4Wv3t9SGuf2W7AdvjBGSbbByhulHr',
      pactBrokerPassword: '4yMCIXCShogvfiEaESHdcBy07VOwm8WG'
    }

    return verifier.verifyProvider(opts)
      .then(output => {
        console.log('Pact Verification Complete!')
        console.log(output)
      })
  })
})
