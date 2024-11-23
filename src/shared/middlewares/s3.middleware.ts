import {
 S3Client,
 PutObjectCommand,
 PutObjectCommandInput,
 GetObjectCommand,
 GetObjectCommandInput,
 DeleteObjectCommandInput,
 DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import config from "../config/config";
import sharp from "sharp";
import Utils from "../services/Utils.service";
import catchAsync from "../helpers/catchAsync";
import { NextFunction, Response, Request } from "express";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class S3Middleware {
 static s3 = new S3Client({
  region: config.aws.bucketRegion,
  credentials: {
   accessKeyId: config.aws.awsAccessKey,
   secretAccessKey: config.aws.awsSecretAccessKey,
  },
 });

 static uploadImageToS3 = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   if (!req.file?.buffer) return next();

   const buffer = await sharp(req.file.buffer)
    .resize({ height: 500, width: 500, fit: "contain" })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toBuffer();

   const fileName = Utils.getRandomImageName();

   const params: PutObjectCommandInput = {
    Bucket: config.aws.bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: req.file.mimetype,
   };

   const command = new PutObjectCommand(params);
   const result = await this.s3.send(command);

   if (!result) return next();

   req.body.image = fileName;

   next();
  }
 );

 static getS3ImageUrl = (imageName: string) => {
  const params: GetObjectCommandInput = {
   Bucket: config.aws.bucketName,
   Key: imageName,
  };
  const command = new GetObjectCommand(params);
  const url = getSignedUrl(this.s3, command, { expiresIn: 20 });
  return url;
 };

 static deleteS3Image = async (imageName: string) => {
  const params: DeleteObjectCommandInput = {
   Bucket: config.aws.bucketName,
   Key: imageName,
  };
  const command = new DeleteObjectCommand(params);
  const result = await this.s3.send(command);
  return result;
 };
}

export default S3Middleware;
