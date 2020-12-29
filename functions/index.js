const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query;
require("faunadb").config();

const typeDefs = gql`
  type Query {
    allTasks: [Task!]
  }
  type Mutation {
    addTask(task: String!): Task
    updateTask(id: ID!): Todo
  }
  type Task {
    id: ID!
    text: String!
    completed: Boolean!
  }
`;
const resolvers = {
  Query: {
    allTasks: async (root, args, context) => {
      try {
        const adminClient = new faunadb.Client({
          secret: process.env.FAUNADB_SECRET,
        });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("all_tasks"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        console.log(result.ref.data);

        return [{}];
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    addTask: async (_, { text }) => {
      try {
        const client = new faunadb.Client({
          secret: process.env.FAUNADB_SECRET,
        });
        const result = await client.query(
          q.Create(q.Collection("tasks"), {
            data: {
              text,
              completed: false,
            },
          })
        );
        return [{}];
      } catch (error) {
        return error.toString();
      }
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
exports.handler = server.createHandler();
