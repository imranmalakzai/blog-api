import ApiError from "../utils/apiError.js";

export const authoriz = (...rols) => {
  return (req, res, next) => {
    try {
      if (!rols.includes(req.user.role)) {
        throw new ApiError("Access denied", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
