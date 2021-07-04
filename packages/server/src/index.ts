import { ApolloServer, gql } from 'apollo-server';
import { handleFileUpload } from './utils/s3';

const server = new ApolloServer({
  typeDefs: gql`
    type S3Object {
      Etag: String
      Location: String!
      Key: String!
      Bucket: String!
    }
    type UploadedFileResponse {
      filename: String!
      mimetype: String!
      encoding: String!
      url: String!
    }
    type Query {
      hello: String!
    }

    type Mutation {
      uploadFile(file: Upload!): S3Object
    }
  `,
  resolvers: {
    Mutation: {
      uploadFile: async (_, { file }) => {
        const res = await handleFileUpload(file);
        return res;
      },
    },
  },
});
server.listen().then(({ url }) => {
  console.log(`server ready at ${url}`);
});
