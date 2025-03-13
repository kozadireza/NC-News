const apiRouter = require("express").Router();
const usersRouter = require("./routers_/users-router");
const articlesRouter = require("./routers_/articles-router");
const topicsRouter = require("./routers_/topics-router");
const { use } = require("../app");
const commentsRouter = require("./routers_/comments-router");

apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
