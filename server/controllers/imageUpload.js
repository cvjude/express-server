/* eslint-disable linebreak-style */
import dotenv from 'dotenv';
import util from '../helpers/Utilities';

const cloudinary = require('cloudinary').v2;

dotenv.config();

/**
 * @class
 * @description upload image controller
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} Json
 * @memberof Controller
 */
class Upload {
  /**
   * @static
   * @description Sets account status to either active or dormant
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} Json
   * @memberof Controller
   */
  static async upload(req, res) {
    let data;

    try {
      data = await cloudinary.uploader.upload(req.body.image.path, {
        tags: 'basic_sample'
      });
    } catch (error) {
      return util.errorStatus(res, 400, 'Unable to upload');
    }

    return util.successStat(res, 200, 'data', {
      url: data.url
    });
  }
}

export default Upload;
