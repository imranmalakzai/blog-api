import ApiError from "../utils/apiError.js";

export const validMemeber = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.publicationRole)) {
      throw new ApiError("Access denied", 403);
    }
    next();
  };
};
