import express from 'express';
import 'express-async-errors';
import ArticleController from '../controllers/articleController';
import middlewares from '../middlewares';

const router = express.Router();

const {
  validateArticle,
  verifyToken,
  validateFilter,
  validateKeyword,
  optionalLogin
} = middlewares;

const {
  createArticle,
  getAllArticles,
  getOneArticle,
  editArticle,
  deleteArticle,
} = ArticleController;

// gets all article with option of passing a keyoword as query
router.get('/:type', validateKeyword, getAllArticles);
router.post('/:type', verifyToken, validateArticle, createArticle);
router.get('/:type/:slug', optionalLogin, getOneArticle);
router.put('/:slug/edit', verifyToken, editArticle);
router.delete('/:type/:slug', verifyToken, deleteArticle);

// filters article search result based on selected filters
router.post('/search/filter', validateFilter, getAllArticles);

export default router;
