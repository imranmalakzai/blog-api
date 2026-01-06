export const asyncHandler = (requrestHandler) => {
  return async (req, res, next) => {
    try {
      await requrestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
