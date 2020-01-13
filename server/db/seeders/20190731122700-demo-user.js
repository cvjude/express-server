module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('Users', [
      {
        firstname: 'Admin',
        lastname: 'doe',
        username: 'j_doe23',
        email: 'john.doe@test.com',
        password:
          '$2a$06$loVt9DxXF97PGJxkjyfJj.PVHNz5FUjNhU4yXIzTK4HQ2EesmuoPi',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),
  down: queryInterface => queryInterface.dropAllTables()
};
