import ApiError from "../utils/apiError.js";
const globleErrorHandlerMiddleWare = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ ...err, message: err.message });
  }
  res.status(err.statusCode || 500).json({ ...err, message: err.message });
  try {
  } catch (error) {
    res.status(500).json({ ...error, message: error.message });
  }
};
