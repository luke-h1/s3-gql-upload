import { gql, ApolloServer } from 'apollo-server';
import { AWSS3Uploader } from './lib/uploaders/s3';

const s3Uploader = new AWSS3Uploader({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  bucketName: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_BUCKET_REGION,
});

const server = new ApolloServer({
  typeDefs: gql`
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
      singleUpload(file: Upload!): UploadedFileResponse!
      multipleUpload(files: [Upload!]!): UploadedFileResponse!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'Hey!',
    },
    Mutation: {
      singleUpload: s3Uploader.singleFileUploadResolver.bind(AWSS3Uploader),
      multipleUpload: s3Uploader.multipleUploadsResolver.bind(AWSS3Uploader),
    },
  },
});
server.listen().then(({ url }) => {
  console.log(`Server started on ${url}`);
});
