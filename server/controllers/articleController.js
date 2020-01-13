import uuid from 'uuid';
import sequelize, { Op } from 'sequelize';
import dotenv from 'dotenv';
import models from '../db/models';
import helpers from '../helpers';
// import Paginate from '../helpers/paginate';

dotenv.config();

const {
  querySearch, filterSearch, errorStat, successStat
} = helpers;

// const { paginate } = Paginate;
const { Tags, Categories } = models;
/**
 * @Module ArticleController
 * @description Controlls all activities related to Articles
 */
class ArticleController {
  /**
   * @description Creates an Article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Article data
   * @memberof ArticleController
   */
  static async createArticle(req, res) {
    const {
      title, description, articleBody, image, type
    } = req.body;

    const readTime = Math.floor(articleBody.split(' ').length / 200);
    const article = await models.Article.create({
      type,
      title,
      description,
      articleBody,
      uuid: uuid.v1().split('-')[0],
      image,
      readTime
    });

    return successStat(res, 201, 'articles', article);
  }

  /**
   * @description returns all Articles
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} An array of all Articles
   * @memberof ArticleController
   */
  static async getAllArticles(req, res) {
    const {
      searchQuery, type, filters, limit, page
    } = req.body;
    const queryFilters = filters || {};

    let articles;
    if (!searchQuery) {
      articles = await models.Article.findAll({ limit, offset: page, where: { type } });
    } else if (searchQuery && Object.keys(queryFilters)[0] === 'undefined') {
      articles = await filterSearch(type, searchQuery, queryFilters, limit, page);
    } else {
      articles = await querySearch(type, searchQuery, limit, page);
    }
    return successStat(res, 200, 'articles', articles);
  }

  /**
   * @description get a sinlge article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} returns a single article
   * @memberof ArticleController
   */
  static async getOneArticle(req, res) {
    const { slug, type } = req.params;

    const article = await models.Article.findOne({
      where: {
        [Op.and]: { type, slug }
      }
    });

    if (!article) {
      return errorStat(res, 404, 'Article not found');
    }

    return successStat(res, 200, 'article', article);
  }

  /**
   * @description Edit an Article and returns the edited article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} Edited article
   * @memberof ArticleController
   */
  static async editArticle(req, res) {
    const {
      title, description, articleBody, image, type
    } = req.body;
    const { slug } = req.params;
    const editedArticle = await models.Article.update(
      {
        title,
        type,
        description,
        articleBody,
        image
      },
      {
        returning: true,
        where: {
          [Op.and]: { type, slug }
        }
      }
    );

    if (editedArticle[1].length < 1) {
      return errorStat(res, 404, 'Article not found');
    }
    const article = editedArticle[1][editedArticle[1].length - 1].dataValues;

    return successStat(res, 200, 'article', article);
  }

  /**
   * @description Deletes an Article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a message indicating that the article was deleted
   * @memberof ArticleController
   */
  static async deleteArticle(req, res) {
    const { type, slug } = req.params;
    console.log(type, slug);
    const deletedArticle = await models.Article.destroy({
      returning: true,
      where: {
        [Op.and]: { type, slug }
      }
    });

    if (!deletedArticle) {
      return errorStat(res, 404, 'Article not found');
    }
    return successStat(res, 200, 'message', 'Article deleted successfully');
  }

  /**
   * @description Gets the featured article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {String} returns a link to the article on twitter website
   */
  static async getFeaturedArticles(req, res) {
    const article = await models.Article.findOne({
      attributes: [
        [sequelize.fn('max', sequelize.col('likesCount')), 'highestLikes']
      ]
    });
    const featuredArticle = await models.Article.findOne({
      where: { likesCount: article.dataValues.highestLikes },
      attributes: {
        exclude: ['tagList']
      },
      include: [
        {
          model: models.Comment,
          as: 'comment'
        },
        {
          model: Categories,
          attributes: ['name'],
          through: { attributes: [] },
          duplicating: false
        },
        {
          model: Tags,
          attributes: ['name'],
          through: { attributes: [] },
          duplicating: false
        },
        {
          as: 'author',
          model: models.User,
          attributes: ['firstname', 'lastname', 'image', 'username']
        }
      ],
      group: ['Article.id']
    });
    return successStat(res, 200, 'article', featuredArticle);
  }
}

export default ArticleController;
