import { ReadStream } from 'fs';

export type File = {
  filename: string;
  mimetype: string;
  encoding: string;
  stream?: ReadStream;
};

export type UploadedFileResponse = {
  filename: string;
  mimetype: string;
  encoding: string;
  url: string;
};

export interface IUploader {
  singleFileUploadResolver: (
    // @ts-ignore
    parent,
    { file }: { file: Promise<File> }
  ) => Promise<UploadedFileResponse>;
}
