import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { nanoid } from 'nanoid'
import * as qiniu from 'qiniu';
import * as path from 'path';
import * as fs from 'fs-extra';
import baseConfig from 'src/config/base.config';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class FileService {
  constructor() {}

  async upload(file: Express.Multer.File) {
    console.log(file)
    try {
      const url = await this.uploadToQiniu(file);
      const fileInfo = {
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        filename:file.filename,
        url: url,
      };
      // 这里用中间件下载了一份到本地所以删除
      await fs.remove(file.path);
      return fileInfo;
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},{ message : error.message})
    }
  }

  async uploadToQiniu(file: Express.Multer.File): Promise<string> {
    const OSS_qiniu = baseConfig.OSS.qiniu
    const mac = new qiniu.auth.digest.Mac(OSS_qiniu.AccessKey,OSS_qiniu.SecretKey );
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: OSS_qiniu.Bucket,
    });
    const uploadToken = putPolicy.uploadToken(mac);

    const formUploader = new qiniu.form_up.FormUploader(
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z1, //华北
      }),
    );
    
    const filename = Date.now() + '-' + nanoid() + path.extname(file.originalname);

    const qiniuHost = OSS_qiniu.Host;
    return new Promise((resolve ,rejects) => {
      formUploader.put(
        uploadToken,
        filename,
        file.buffer,
        new qiniu.form_up.PutExtra(),
        function (respErr, respBody, respInfo) {
          if (respErr) {
            rejects({message : respErr.message})
          }
          if (respInfo.statusCode == 200) {
            resolve(new URL(respBody.key, qiniuHost).href);
          } else {
            rejects({message : respInfo.data.error})
          }
        },
      );
    });
  }


  async uploadToLocal(file: Express.Multer.File){
    return {
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      filename:file.filename,
      url: '/uploads/' + file.filename
    };
  }
}