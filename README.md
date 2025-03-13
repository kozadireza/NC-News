# NC News Seeding

https://nc-news-b8jg.onrender.com

A RESTful API for managing and interacting with news articles, topics, comments, and users. This project is designed to simulate the backend of a news aggregation platform, allowing users to retrieve, post, update, and delete data.

## Hosted Version

## You can access the hosted version of this API here: [https://nc-news-b8jg.onrender.com]

## Features

- **Topics**: Fetch all topics available on the platform.
- **Articles**: Retrieve articles with filtering, sorting, and pagination options.
- **Comments**: Post, update, and delete comments on articles.
- **Users**: Fetch user data with filtering and sorting options.

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js**: Minimum version `18.x`
- **PostgreSQL**: Minimum version `14.x`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

- Setting Up Environment Variables

2. **Create two environment files**:
   .env.development
   .env.test

3. **Install dependencies**:

npm install

4. **Add the following lines to each file**:

In .env.development:

PGDATABASE=_name of your DATABASE for DEVELOPMENT_

In .env.test:

PGDATABASE=_name of your DATABASE for TESTING_

5. **Seed the local database**:

npm run setup-dbs
npm run seed-dev
npm run test

**API Endpoints**

#GET#

[/api]
Serves a JSON representation of all available endpoints.

[/api/topics]
Fetch all topics

[/api/articles]
Fetch all articles, sorted by the most recent first by default.

\*Available Queries:
author: Filter articles by a specific author.
topic: Filter articles by a specific topic.
sort_by: Sort articles by any valid column (e.g., created_at, votes, title). Defaults to created_at.
order: Specify the order of sorting (asc for ascending or desc for descending). Defaults to desc.

[/api/articles/:article_id]
Fetch a single article by its unique article_id.

[/api/articles/:article_id/comments]
Fetch all comments for a specific article, sorted by the most recent first by default.

[/api/users]
Fetch all users.

#DELETE#

[/api/comments/:comment_id]
Delete a comment by its unique comment_id.

#POST#

["/api/articles/:article_id/comments"]

#PATCH#
["/api/articles/:article_id"]

**Error Handling**

This API includes comprehensive error handling to ensure clear and helpful responses for users.
Below are the key error types and their respective messages:

400 - Invalid data format: Triggered when data types are incorrect (e.g., attempting to pass a string instead of a number).
400 - Invalid column name: Occurs when querying a non-existent column in the database.
400 - Resource not found: Triggered when referencing data that does not exist (e.g., adding a comment to a non-existent article).
400 - Invalid query syntax: Triggered when a query has incorrect syntax.
400 - Bad Request — For invalid or malformed data requests.

404 Page not found - Any undefined endpoint.

500 Unable to reach server.
