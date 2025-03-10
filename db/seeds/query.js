const db = require("../connection");
const format = require("pg-format");

// Get all of the users
// Get all of the articles where the topic is coding
// Get all of the comments where the votes are less than zero
// Get all of the topics
// Get all of the articles by user grumpy19
// Get all of the comments that have more than 10 votes.

async function selectionFromDB() {
  const fullselection = (await db.query(`SELECT * FROM users`)).rows;
  //console.log(fullselection, "<<<<<< fullselection of USERS");

  const codingArticles = (
    await db.query(`SELECT * FROM articles WHERE topic = 'coding'`)
  ).rows;
  //console.log(codingArticles, "<<<<<< selection of 'coding' articles");
  const lowVotedComments = (
    await db.query(`SELECT * FROM comments WHERE votes < 0`)
  ).rows;
  //   console.log(
  //     lowVotedComments,
  //     "<<<<<< selection of comments with negative amount of votes"
  //   );
  const allTopics = (await db.query(`SELECT * FROM topics`)).rows;
  //   console.log(allTopics, "<<<<<< selection of all topics in DB");

  const allGrumpy19Articles = (
    await db.query(`SELECT * FROM articles WHERE author = 'grumpy19'`)
  ).rows;
  //   console.log(allGrumpy19Articles, "<<<< selection of user's articles");

  const commentsWITH10 = (
    await db.query(`SELECT * FROM comments WHERE votes > 10`)
  ).rows;
  console.log(commentsWITH10, "<<<< selection of user's articles");
}

selectionFromDB();
