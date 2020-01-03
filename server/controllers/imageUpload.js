/* eslint-disable linebreak-style */
import util from '../helper/utilities';
import dotenv from 'dotenv';

const cloudinary = require('cloudinary').v2;
dotenv.config();

class Social {
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

    // set your env variable CLOUDINARY_URL or set the following configuration
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET
    });

    try {
      data = await cloudinary.uploader.upload(req.body.image.path, {
        tags: 'basic_sample'
      });
    } catch (error) {
      return util.errorstatus(res, 400, 'Unable to upload');
    }

    return util.successStatus(res, 200, 'data', {
      url: data.url
    });
  }
}

export default Social;
