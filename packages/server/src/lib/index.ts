import { ReadStream } from 'fs';

export namespace ApolloServerFileUploads {

  export type File = {
    filename: string;
    mimetype: string;
    encoding: string;
    stream?: ReadStream;
  }

  export type UploadedFileResponse = {
    filename: string;
    mimetype: string;
    encoding: string;
    url: string;
  }

  export interface IUploader {
        // @ts-ignore

    singleFileUploadResolver: (parent, { file } : { file: File }) => Promise<UploadedFileResponse>;
        // @ts-ignore

    multipleUploadsResolver: (parent, { files } : { files: File[] }) => Promise<UploadedFileResponse[]>;
  }
}
