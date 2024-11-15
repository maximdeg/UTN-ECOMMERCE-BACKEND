import UserRepository from "../repositories/user.repository.js";

const validateEmail = (value) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return regex.test(String(value).toLowerCase());
};

const validateUsernameLength = (value) => {
  return value.length > 3;
};

const validatePasswordLength = (value) => {
  return value.length > 8;
};

const validateProductNameLength = (value) => {
  return value.length > 5;
};

const validateDescriptionLength = (value) => {
  return value.length > 15;
};

const validatePriceAndStockValue = (value) => {
  return value > 0;
};

const validateCategorySelection = (value) => {
  return value !== null;
};

const validateEmptyFields = (value) => {
  return value !== "";
};

// const validateSellerId = async (id) => {
//   try {
//     const user_id = await UserRepository.getById(id);
//     return user_id !== null;
//   } catch (err) {
//     console.error("Mongoose error:", err.message);
//     if(){

//     }
//   }
// };

// const validateActiveEmail = async (email) => {
//   try {
//     const user = await UserRepository.getByEmail(email);
//     return user.emailVerified;
//   } catch (err) {
//     console.error("Mongoose error:", err.message);
//   }
// };

/**
 * Validate if the email already exists in the database
 * @param {string} email - email to validate
 * @returns {Promise<boolean>} true if the email does not exist, false if it does
 */
// const validateEmailExistsAlready = async (email) => {
//   try {
//     const product = await ProductRepository.getByEmail(email);
//     return product === null;
//   } catch (err) {
//     console.error("Mongoose error:", err.message);
//   }
// };

export const ERRORS = {
  USERNAME_LENGTH: {
    message: "Your name must be more than 3 characters",
    id: 1,
    property: "name",
    validate: validateUsernameLength,
  },
  PASSWORD_LENGTH: {
    message: "Your password must be more than 8 characters",
    id: 2,
    property: "password",
    validate: validatePasswordLength,
  },
  EMAIL_NOT_VALID: {
    message: "Email format not valid",
    id: 3,
    property: "email",
    validate: validateEmail,
  },
  USER_NOT_FOUND: {
    message: "Email and/or password are incorrect",
    id: 4,
    validate: validatePasswordLength,
  },
  PRODUCT_NAME_LENGTH: {
    message: "The name of the product must be more than 5 characters",
    id: 5,
    property: "name",
    validate: validateProductNameLength,
  },
  PRODUCT_DESCRIPTION_LENGTH: {
    message: "Description must be more than 15 characters",
    id: 6,
    property: "description",
    validate: validateDescriptionLength,
  },
  PRODUCT_PRICE_VALUE: {
    message: "Price must be more than 0",
    id: 7,
    property: "price",
    validate: validatePriceAndStockValue,
  },
  PRODUCT_STOCK_VALUE: {
    message: "Stock must be more than 0",
    id: 8,
    property: "stock",
    validate: validatePriceAndStockValue,
  },
  PRODUCT_CATEGORY_LENGTH: {
    message: "Please select a category.",
    id: 9,
    property: "category",
    validate: validateCategorySelection,
  },
  // PRODUCT_SELLER_ID_LENGTH: {
  //   message: "This seller does not exist",
  //   id: 10,
  //   property: "seller_id",
  //   validate: validateSellerId,
  // },
  EMPTY_FIELD: {
    message: "Please complete the following field",
    id: 11,
    validate: validateEmptyFields,
  },
  // EMAIL_NOT_VERIFIED: {
  //   message: "Please verify your email address, we sent an email with the confirmation link.",
  //   id: 12,
  //   property: "email",
  //   validate: validateActiveEmail,
  // },
  // EMAIL_EXISTS_ALREADY: {
  //   message: "This email is registered already, please log in",
  //   id: 13,
  //   property: "email",
  //   validate: validateEmailExistsAlready,
  // },
};
