/* eslint-disable func-names */
import SequelizeSlugify from 'sequelize-slugify';

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    articleBody: DataTypes.TEXT,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    uuid: DataTypes.STRING,
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    readTime: DataTypes.INTEGER,
    image: DataTypes.TEXT
  });

  SequelizeSlugify.slugifyModel(Article, {
    source: ['title'],
    suffixSource: ['uuid'],
    slugOptions: { lower: true }
  });
  Article.associate = (models) => { };
  return Article;
};
