import uuid from 'uuid';
import sequelize from 'sequelize';
import dotenv from 'dotenv';
import models from '../db/models';
import helpers from '../helpers';
import Paginate from '../helpers/paginate';
import Notification from '../helpers/notifications';

dotenv.config();

const { querySearch, filterSearch, errorStat, successStat } = helpers;

const { paginate } = Paginate;
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
    const { title, description, articleBody, image, type } = req.body.article;
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
    const { searchQuery } = req.query;
    const queryFilters = req.body;

    let articles;
    const { page, limit } = req.query;
    if (!page && !limit) {
      if (!searchQuery) {
        articles = await models.Article.findAll({});
      } else if (searchQuery && Object.keys(queryFilters)[0] !== 'undefined') {
        articles = await filterSearch(searchQuery, queryFilters);
      } else {
        articles = await querySearch(searchQuery);
      }
      return successStat(res, 200, 'articles', articles);
    }
    paginate(page, limit, models.Article, 'articles', res, req, []);
  }

  /**
   * @description get a sinlge article
   * @param {Object} req - request object
   * @param {Object} res - response object
   * @returns {Object} returns a single article
   * @memberof ArticleController
   */
  static async getOneArticle(req, res) {
    const { slug } = req.params;

    const article = await models.Article.findOne({
      where: {
        slug
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
    const { title, description, articleBody, image } = req.body.article;
    const editedArticle = await models.Article.update(
      {
        title,
        description,
        articleBody,
        tagList,
        image
      },
      {
        returning: true,
        where: {
          slug: req.params.slug
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
    const deletedArticle = await models.Article.destroy({
      returning: true,
      where: {
        slug: req.params.slug
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
