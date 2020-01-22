module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING
    },
    articleBody: {
      type: Sequelize.TEXT
    },
    description: {
      type: Sequelize.TEXT
    },
    slug: {
      type: Sequelize.STRING
    },
    uuid: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    readTime: { type: Sequelize.INTEGER, allowNull: false },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Articles')
};
