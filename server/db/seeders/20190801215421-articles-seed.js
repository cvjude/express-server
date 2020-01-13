'use strict';

const _ = require('lodash');
const faker = require('faker');

const articleBody = () => `{"time":1567964598055,"blocks":[{"type":"paragraph","data":{"text":"${faker.lorem.paragraph()}"}}],"version":"2.15.0"}`;

const type = ['blog', 'publications', 'news', 'events'];

module.exports = {
  up: (queryInterface) => {
    const randomArticles = _.times(300, () => {
      const title = faker.name.title();
      return {
        title,
        description: faker.lorem.sentence(),
        articleBody: articleBody(),
        uuid: faker.random.number({ max: '300' }),
        slug: title.split(' ').join('-') || title,
        type: faker.random.arrayElement(type),
        image: `https://picsum.photos/${faker.random.number({
          min: 1000,
          max: 1500
        })}`,
        readTime: faker.random.number({ min: 1, max: 10 }),
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    return queryInterface.bulkInsert('Articles', randomArticles, {});
  },

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
