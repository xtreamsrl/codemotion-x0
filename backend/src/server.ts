import Fastify from 'fastify';
import cors from '@fastify/cors';
import { pipeline } from './pipeline';

const fastify = Fastify({
  logger: true,
});

(async () => {
  await fastify.register(cors, {
    // put your options here
  });

  // Declare a route
  fastify.post('/generate', async (request, reply) => {
    const data = request.body;
    console.log(data);
    const inputs = {
      userDescription: (request.body as any).description
    };
    const result = await pipeline(inputs);

    reply.send(result);
  });

  // Run the server!
  fastify.listen({ port: 8080 }, (err, address) => {
    if (err) throw err;
  });
})();
