import { ApolloServer, gql } from 'apollo-server';
import { AWSS3Uploader } from './lib/uploaders/s3';

const s3Uploader = new AWSS3Uploader({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  destinationBucketName: process.env.AWS_DESTINATION_BUCKET_NAME!,
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
      multipleUpload (files: [Upload!]!): UploadedFileResponse!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'Hey!',
    },
    Mutation: {

      /**
       * This is where we hook up the file uploader that does all of the
       * work of uploading the files. With Cloudinary and S3, it will:
       *
       * 1. Upload the file
       * 2. Return an UploadedFileResponse with the url it was uploaded to.
       *
       * Feel free to pick through the code an IUploader in order to
       */

      singleUpload: s3Uploader.singleFileUploadResolver.bind(s3Uploader),
      multipleUpload: s3Uploader.multipleUploadsResolver.bind(s3Uploader),
    },
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
