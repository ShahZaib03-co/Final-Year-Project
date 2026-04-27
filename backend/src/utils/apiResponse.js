/**
 * Standardized API response helpers
 */

const successResponse = (res, statusCode, message, data = {}, meta = {}) => {
  const response = { success: true, message };
  if (Object.keys(data).length > 0) response.data = data;
  if (Object.keys(meta).length > 0) response.meta = meta;
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode, message, errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };
