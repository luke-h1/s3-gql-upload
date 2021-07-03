"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSS3Uploader = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const stream_1 = __importDefault(require("stream"));
class AWSS3Uploader {
    constructor(config) {
        aws_sdk_1.default.config = new aws_sdk_1.default.Config();
        aws_sdk_1.default.config.update({
            signatureVersion: 's3v4',
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        });
        this.s3 = new aws_sdk_1.default.S3();
        this.config = config;
    }
    createUploadStream(key) {
        const pass = new stream_1.default.PassThrough();
        return {
            writeStream: pass,
            promise: this.s3
                .upload({
                Bucket: this.config.bucketName,
                Key: key,
                Body: pass,
            })
                .promise(),
        };
    }
    createDestinationFilePath(fileName, mimetype, encoding) {
        return fileName;
    }
    singleFileUploadResolver(parent, { file }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { stream, filename, mimetype, encoding, } = yield file;
            const filePath = this.createDestinationFilePath(filename, mimetype, encoding);
            const uploadStream = this.createUploadStream(filePath);
            stream === null || stream === void 0 ? void 0 : stream.pipe(uploadStream.writeStream);
            const result = yield uploadStream.promise;
            console.log(result.Location);
            return {
                filename, mimetype, encoding, url: result.Location,
            };
        });
    }
    multipleUploadsResolver(parent, { files }) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(files.map((f) => this.singleFileUploadResolver(null, { file: f })));
        });
    }
}
exports.AWSS3Uploader = AWSS3Uploader;
//# sourceMappingURL=s3.js.map