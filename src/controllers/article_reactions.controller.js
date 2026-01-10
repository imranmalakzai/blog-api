// import { asyncHandler } from "../utils/asyncHandler.js";
// import ApiError from "../utils/apiError.js";
// import * as reactionRepo from "../repository/article_rection.repository.js";
// import * as articlesRepo from "../repository/articals.repsitory.js";

// //** like an article */
// export const like = asyncHandler(async (req, res) => {
//   const { articleId } = req.params;
//   const {reactionId} = req.params

//   // article exist
//   const article = articlesRepo.getArticleById(articleId);
//   if (!article) throw new ApiError("article not exist", 404);

//   //like article
//   const like = await reactionRepo.createLikeArticle({
//     article_id: articleId,
//     user_id: req.user.id,
//     reaction_id:
//   });
// });
