import ApiError from "../utils/apiError.js";

export const allowed = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError("Access Denied", 403);
    }
    next();
  };
};
