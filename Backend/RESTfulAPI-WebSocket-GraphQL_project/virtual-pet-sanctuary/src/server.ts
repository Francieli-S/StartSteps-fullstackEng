import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import router from './routes.js';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
// this function enable the use o subscription in the schema, what enables the use of ws.
// it means that using gql and ws the client can receive responses without request.
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const app = express();
app.use(express.json());
app.use('/api/pets', router);

const port: number = 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });
const apolloServer = new ApolloServer({ schema });

await apolloServer.start();
apolloServer.applyMiddleware({ app });

const httpServer = createServer(app);

const webSocketServer = new WebSocketServer({
  server: httpServer,
  path: apolloServer.graphqlPath
})

useServer({schema}, webSocketServer)

httpServer.listen({ port }, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`RESTful API Server ready at http://localhost:${port}/api/pets`);
  console.log(
    `GraphQL server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );
});
