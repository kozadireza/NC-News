const db = require("../connection");
const format = require("pg-format");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return (
    db
      .query(`DROP TABLE IF EXISTS comments`)
      .then(() => {
        return db.query("DROP TABLE IF EXISTS articles;");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS topics;");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS users;");
      })
      .then(() => {
        return createTopicsTable();
      })
      .then(() => {
        return createUsersTable();
      })
      .then(() => {
        return createArticlesTable();
      })
      .then(() => {
        return createCommentsTable();
      })
      .then(() => {
        return insertTopicsData({ topicData });
      })
      .then(() => {
        return insertUsersData({ userData });
      })
      .then(() => {
        return isertArticlesData({ articleData });
      })
      // .then(() => {
      //   return updateArticlesVotes();
      // })
      .then(() => {
        return isertCommentsData({ commentData });
      })
  );
};

function createTopicsTable() {
  return db.query(`CREATE TABLE topics (
    slug varchar unique primary key,
    description varchar not null,
    img_url VARCHAR(1000)
);`);
}

function createUsersTable() {
  return db.query(`CREATE TABLE users (
  username varchar unique not null primary key,
  name varchar not null,
  avatar_url VARCHAR(1000)
);`);
}

function createArticlesTable() {
  return db.query(`CREATE TABLE articles (
    article_id serial unique not null primary key,
    title varchar not null,
    topic varchar references topics(slug),
    author varchar references users(username),
    body text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes int DEFAULT 0,
    article_img_url VARCHAR(1000)
  );`);
}

function createCommentsTable() {
  return db.query(`CREATE TABLE comments (
    comment_id serial unique not null primary key,
    article_id serial references articles(article_id),
    body text,
    votes int DEFAULT 0,
    author varchar references users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
}

function insertTopicsData({ topicData }) {
  const formateTopicData = topicData.map((topic) => {
    return [topic.slug, topic.description, topic.img_url];
  });

  const readyQurery = format(
    `INSERT INTO topics (slug, description, img_url) VALUES %L returning slug`,
    formateTopicData
  );
  return db.query(readyQurery);
}

function insertUsersData({ userData }) {
  const formateTopicData = userData.map((user) => {
    return [user.username, user.name, user.avatar_url];
  });

  const readyQurery = format(
    `INSERT INTO users (username, name, avatar_url) VALUES %L returning username`,
    formateTopicData
  );
  return db.query(readyQurery);
}

async function isertArticlesData({ articleData }) {
  const requstToTableTopics = await db.query(`select slug FROM topics`);
  const requstToTableUsers = await db.query(`select username  FROM users`);
  console.log(requstToTableTopics.rows, "<<<<<<<<<,topicRequest");
  console.log(requstToTableUsers.rows, "<<<<<<<<<,UserRequest");
  const formatDataArt = articleData.map((article) => {
    const currentAuthor = requstToTableUsers.rows.filter((user) => {
      if (user.username === article.author) return user.username;
    });

    const currentTopic = requstToTableTopics.rows.filter((topic) => {
      return topic.slug === article.topic;
    });
    // console.log(currentTopic[0].slug);
    return [
      article.title,
      currentTopic[0].slug,
      currentAuthor[0].username,
      article.body,
      article.votes ?? 0,
      article.article_img_url,
    ];
  });
  const readyToInsert = format(
    `INSERT INTO articles (title, topic, author, body, votes, article_img_url) VALUES %L`,
    formatDataArt
  );

  return db.query(readyToInsert);
}
// function updateArticlesVotes() {
//   return db.query(`UPDATE articles SET votes = 0 WHERE votes IS NULL`);
// }
async function isertCommentsData({ commentData }) {
  const requstToTableArt = await db.query(
    `select article_id, title FROM articles`
  );
  const requstToTableUsers = await db.query(`select username  FROM users`);
  console.log(requstToTableArt.rows);
  // console.log(requstToTableUsers.rows);
  const formatDataComents = commentData.map((comment) => {
    const currentAuthor = requstToTableUsers.rows.filter((user) => {
      if (user.username === comment.author) return user.username;
    });

    const currentArticle = requstToTableArt.rows.filter((article) => {
      //console.log(article.title);
      return article.title === comment.article_title;
    });
    console.log(currentArticle);
    return [
      currentArticle[0].article_id,
      comment.body,
      comment.votes,
      currentAuthor[0].username,
    ];
  });
  const readyToInsert = format(
    `INSERT INTO comments (article_id, body, votes, author) VALUES %L`,
    formatDataComents
  );

  return db.query(readyToInsert);
}

module.exports = seed;
