const { server } = require('./consumer.js')

server.listen(8080, () => {
  console.log('Service listening on http://localhots:8080')
})
