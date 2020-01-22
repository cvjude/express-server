import sequelize from 'sequelize';
import dotenv from 'dotenv';
import models from '../db/models';
import helpers from '../helpers';

dotenv.config();

const { Op } = sequelize;

const {
  addToBlacklist,
  generateToken,
  errorStat,
  successStat,
  comparePassword,
  hashPassword
} = helpers;

/**
 * @Module UserController
 * @description Controlls all the user based activity
 */
class UserController {
  /**
   * @static
   * @description Allows a user to sign up
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} object containing user data and access Token
   * @memberof UserController
   */
  static async signUp(req, res) {
    const {
      firstname, lastname, email, username, password
    } = req.body;

    console.log(req.body);

    const existingUser = await models.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });
    if (existingUser) {
      return errorStat(res, 409, 'User Already Exists');
    }
    const newUser = {
      ...req.body,
      password: hashPassword(password),
      verified: false
    };
    const user = await models.User.create(newUser);
    const token = generateToken({ id: user.id, username, email });

    return successStat(res, 201, 'user', {
      id: user.id,
      token,
      username,
      firstname,
      lastname,
      email
    });
  }

  /**
   * @static
   * @description Allows a user to sign in
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} object containing user data and access Token
   * @memberof UserController
   */
  static async login(req, res) {
    const { username, password } = req.body;
    const user = await models.User.findOne({ where: { username } });

    if (!user) return errorStat(res, 401, 'Incorrect Login information');
    const matchPasswords = comparePassword(password, user.password);
    if (!matchPasswords) {
      return errorStat(res, 401, 'Incorrect Login information');
    }
    return successStat(res, 200, 'user', {
      id: user.id,
      token: await generateToken({
        id: user.id,
        username: user.username
      }),
      firstname: user.firstname,
      lastname: user.firstname,
      username: user.username,
      email: user.email
    });
  }

  /**
   * @static
   * @description Allows a user to sign out
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} object containing the user's profile
   * @memberof UserController
   */
  static async logout(req, res) {
    const authorizationHeader = req.headers.authorization;
    const token = req.headers.authorization.split(' ')[1] || authorizationHeader;
    await addToBlacklist(token);
    return successStat(res, 204, 'message', 'No Content');
  }
}

export default UserController;
