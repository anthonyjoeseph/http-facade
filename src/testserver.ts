import {createServer} from './http'

const server = createServer(
  async (req) => ({
    body: req.body + " and more!",
  })
)
server.listen(80)
.on('interruptedBody', (fragment) => {
  console.log('servis interruptis!')
  console.log(fragment.body)
})