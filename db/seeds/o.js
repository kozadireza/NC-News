async function isertArticlesData({ articleData }) {
  const requstToTableTopics = await db.query(`select slug FROM topics`);
  const requstToTableUsers = await db.query(`select username  FROM users`);
  // console.log(requstToTableTopics.rows);
  // console.log(requstToTableUsers.rows);
  const formatDataArt = articleData.map((article) => {
    const currentTopic = requstToTableUsers.filter((user) => {
      if (user.username === article.author) return user.usernam;
    });
    const currentAuthor = requstToTableTopics.rows.filter((topic) => {
      if (topic.slug === article.topic) {
        return topic.slug;
      }
    });

    return [
      article.title,
      currentTopic,
      currentAuthor,
      article.body,
      article.votes,
      article.article_img_url,
    ];
  });
  const readyToInsert = format(
    `INSERT INTO articles(title, topic, author, body, votes,article_img_url) VALUES %L`,
    formatDataArt
  );
  return db.query(readyToInsert);
}
