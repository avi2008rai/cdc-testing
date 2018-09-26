const pact = require('@pact-foundation/pact-node')
const path = require('path')
const opts = {
  pactUrls: [path.resolve(__dirname, '../pacts/new-consumer-services-new-provider-services.json')],
  pactBroker: 'https://sapient.pact.dius.com.au/',
  pactBrokerUsername: 'nW4Wv3t9SGuf2W7AdvjBGSbbByhulHr',
  pactBrokerPassword: '4yMCIXCShogvfiEaESHdcBy07VOwm8WG',
  tags: ['prod', 'test'],
  consumerVersion: '1.0.0'
}

pact.publishPacts(opts)
  .then(() => {
    console.log('Pact contract publishing complete!')
    console.log('Head over to https://sapient.pact.dius.com.au/ and login with')
    console.log('=> Username: dXfltyFMgNOFZAxr8io9wJ37iUpY42M')
    console.log('=> Password: O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1')
    console.log('to see your published contracts.')
  })
  .catch(e => {
    console.log('Pact contract publishing failed: ', e)
  })
