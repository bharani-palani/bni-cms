/* eslint-disable-invalid-this */
/* eslint-env es6*/
import { S3Client, S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import CryptoJS from 'crypto-js';
import { encryptSaltKey } from '../crypt';

export default class AwsFactory {
  constructor(contextData) {
    // this.Bucket = CryptoJS.AES.decrypt(contextData.aws_s3_bucket, contextData.user_mail).toString(CryptoJS.enc.Utf8);
    this.Bucket = contextData.aws_s3_bucket;
    this.expiresIn = 24 * 60 * 60;
    this.config = {
      region: CryptoJS.AES.decrypt(
        contextData.aws_s3_region,
        contextData[encryptSaltKey]
      ).toString(CryptoJS.enc.Utf8),
      credentials: {
        accessKeyId: CryptoJS.AES.decrypt(
          contextData.aws_s3_access_key_id,
          contextData[encryptSaltKey]
        ).toString(CryptoJS.enc.Utf8),
        secretAccessKey: CryptoJS.AES.decrypt(
          contextData.aws_s3_secret_access_key,
          contextData[encryptSaltKey]
        ).toString(CryptoJS.enc.Utf8),
      },
    };
    this.self = this;
  }

  getBuckeName() {
    return this.Bucket;
  }

  fetchFileFolder(rest) {
    const params = {
      Bucket: this.Bucket,
      ...(Object.keys(rest).length > 0 && { ...rest }),
    };
    const promise = new S3(this.config).listObjects(params);
    return promise;
  }

  uploadFile = target => {
    const instance = new Upload({
      client: new S3Client(this.config),
      leavePartsOnError: false,
      params: { ...target, Bucket: this.Bucket },
    });
    return instance;
  };

  deleteFile = async rest => {
    const params = {
      Bucket: this.Bucket,
      ...(Object.keys(rest).length > 0 && { ...rest }),
    };
    const promise = new S3(this.config).deleteObject(params);
    return promise;
  };

  deleteFolder = async (folder, callback) => {
    let params = {
      Bucket: this.Bucket,
      Prefix: folder,
    };

    new S3(this.config).listObjects(params, (err, data) => {
      if (err) {
        return callback({ status: 'fail' });
      }
      if (data.Contents.length === 0) {
        callback({ status: 'success' });
      }

      params = { Bucket: this.Bucket };
      params.Delete = { Objects: [] };

      data.Contents.forEach(content => {
        params.Delete.Objects.push({ Key: content.Key });
      });

      new S3(this.config).deleteObjects(params, (err, data) => {
        if (err) {
          return callback({ status: 'fail' });
        }
        if (data.IsTruncated) {
          this.self.deleteFolder(this.Bucket, callback);
        } else {
          callback({ status: 'success' });
        }
      });
    });
  };

  renameFile = async object => {
    const BUCKET_NAME = this.Bucket;
    return new S3(this.config).copyObject(
      {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${object.oldKey}`,
        Key: object.newKey,
      },
      () => {
        new S3(this.config).deleteObject({
          Bucket: BUCKET_NAME,
          Key: object.oldKey,
        });
      }
    );
  };

  renameFolder = async object => {
    const bucketName = this.Bucket;
    const folderToMove = `${object.oldKey}/`;
    const destinationFolder = `${object.newKey}`;

    try {
      const listObjectsResponse = await new S3(this.self.config).listObjects({
        Bucket: bucketName,
        Prefix: folderToMove,
      });

      const folderContentInfo = listObjectsResponse.Contents;
      const folderPrefix = listObjectsResponse.Prefix;

      await Promise.all(
        folderContentInfo.map(async fileInfo => {
          const copyObj = {
            Bucket: bucketName,
            CopySource: `${bucketName}/${fileInfo.Key}`,
            Key: `${destinationFolder}/${fileInfo.Key.replace(
              folderPrefix,
              ''
            )}`,
          };
          await new S3(this.self.config).copyObject(copyObj);

          const delObj = {
            Bucket: bucketName,
            Key: fileInfo.Key,
          };
          await new S3(this.self.config).deleteObject(delObj);
        })
      );
    } catch (err) {
      console.error(err); // error handling
    }
  };
  isUrlInternal = unsignedUrl => {
    const pieces = unsignedUrl ? unsignedUrl.split('/') : ['/'];
    const serviceProvider = pieces[0];
    return serviceProvider !== 'https:';
  };

  getSignedUrl = async Key => {
    if (this.isUrlInternal(Key)) {
      const path = Key.split('/').slice(1, Key.length).join('/');
      const pieces = Key ? Key.split('/') : ['/'];
      const extension = pieces[pieces.length - 1].split('.').pop();

      const params = {
        Bucket: this.Bucket,
        Key: path,
        expiresIn: this.expiresIn,
      };
      const client = new S3Client(this.config);
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(client, command, {
        expiresIn: this.expiresIn,
      });
      return {
        url,
        path,
        extension,
      };
    } else {
      return {
        url: Key,
        path: '',
        extension: '',
      };
    }
  };

  downloadToBrowser = route => {
    const pieces = route.split('/');
    const file = pieces[pieces.length - 1];
    const path = route.split('/').slice(1, route.split('/').length).join('/');
    this.getSignedUrl(path, this.expiresIn, this.Bucket).then(url => {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', url);
      link.setAttribute('download', file);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  fetchStream = async Key => {
    const client = new S3Client(this.config);
    const response = await client
      .send(
        new GetObjectCommand({
          Bucket: this.Bucket,
          Key,
        })
      )
      .then(async res => {
        const reader = res.Body.pipeThrough(
          new TextDecoderStream('utf-8')
        ).getReader();
        const array = [];
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          array.push(value);
        }
        const ele = array.join('');
        return ele;
      });

    return response;
  };
}
