import express from 'express';
import config from '../db/config/cloudinaryConfig';
import uploadController from '../controllers/imageUpload';

const router = express.Router();

router.post('/', config, uploadController.upload);

export default router;
