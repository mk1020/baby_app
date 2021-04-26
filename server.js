const fastify = require('fastify')({ logger: true })
const usersData = require('./users')
const fs = require('fs');

fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.get('/year-now', (request, reply) => {
  reply.send("Текущий год - " + new Date().getFullYear())
})

fastify.get('/my-profile/:userName', (request, reply) => {
  const userName = request.params.userName;
  const userData = usersData.find((user)=> user.username == userName);
  if (userData) {
    reply.send(userData)
  } else {
    reply.status(404).end('Not found))');
  }
})

fastify.post('/my-profile/:userName', (request, reply) => {
  const userData = request.body;
  if (userData.username && userData.lastName && userData.country) {
    usersData.push(userData)
    reply.type('text/plain');
    reply.send('success')
  } else {
    reply.status(400).end('Bad request1');
  }
})


fastify.get('/my-avatar/:avatarName', (request, reply) => {
  const fileName = request.params.avatarName;
  const extCorrect = fileName.includes('.jpg');

  if (extCorrect) {
    const readStream = fs.createReadStream('./avatars/' + fileName);
    readStream.on('open', () => {
      reply.type( 'image/jpg');
      reply.send(readStream)
    })

    readStream.on('error', () => {
      reply.type('text/plain');
      reply.status(404).end('Not found');
    });
  } else {
    return reply.status(403).end('Forbidden');
  }
})

fastify.listen(3000, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
