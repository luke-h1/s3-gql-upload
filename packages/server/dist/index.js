"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const s3_1 = require("./lib/uploaders/s3");
const s3Uploader = new s3_1.AWSS3Uploader({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    bucketName: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_BUCKET_REGION,
});
const server = new apollo_server_1.ApolloServer({
    typeDefs: apollo_server_1.gql `
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
            singleUpload: s3Uploader.singleFileUploadResolver.bind(s3_1.AWSS3Uploader),
            multipleUpload: s3Uploader.multipleUploadsResolver.bind(s3_1.AWSS3Uploader),
        },
    },
});
server.listen().then(({ url }) => {
    console.log(`Server started on ${url}`);
});
//# sourceMappingURL=index.js.map