import Authenticate from './authenticate';
import InputValidator from './inputValidator';
import searchValidator from './searchValidator';

const { validateFilter, validateKeyword } = searchValidator;
const {
  verifyToken, optionalLogin, isActive, isJustAUser
} = Authenticate;
const {
  validateLogin,
  validateUser,
  validateNewUser,
  validateArticle,
  validateProfileUpdate,
  validatePasswordReset,
  validateEmail,
  validateCommentMessage,
  validateLikes,
  validateId,
  validateReportArticle,
  validateHighlightData,
  validateGetHighlight,
  validateRoleInput,
  validateParamsInput,
  validateUpdateUser,
  validateGetUser
} = InputValidator;

export default {
  verifyToken,
  validateLogin,
  validateUser,
  validateNewUser,
  validateProfileUpdate,
  validateArticle,
  validatePasswordReset,
  validateEmail,
  isJustAUser,
  optionalLogin,
  validateCommentMessage,
  validateFilter,
  validateKeyword,
  validateLikes,
  validateId,
  validateReportArticle,
  validateHighlightData,
  validateGetHighlight,
  isActive,
  validateRoleInput,
  validateParamsInput,
  validateUpdateUser,
  validateGetUser
};
