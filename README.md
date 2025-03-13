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

**API Endpoints**

#GET#

[/api](https://vscode.dev/github/kozadireza/NC-News/blob/main/endpoints.json)
Description: Serves a JSON representation of all available endpoints.

[/api/topics](https://vscode.dev/github/kozadireza/NC-News/blob/main/endpoints.json#L8-L10)
Fetch all topics

[/api/articles](https://vscode.dev/github/kozadireza/NC-News/blob/main/endpoints.json#L17-L25)
Fetch all articles, sorted by the most recent first by default.

#Available Queries:

author: Filter articles by a specific author.
topic: Filter articles by a specific topic.
sort_by: Sort articles by any valid column (e.g., created_at, votes, title). Defaults to created_at.
order: Specify the order of sorting (asc for ascending or desc for descending). Defaults to desc.

[/api/articles/:article_id](https://vscode.dev/github/kozadireza/NC-News/blob/main/endpoints.json#L35-L44)

[/api/articles/:article_id/comments](https://vscode.dev/github/kozadireza/NC-News/blob/main/endpoints.json#L53-L60)

[/api/comments/:comment_id]()

Clear instructions of how to clone, install dependencies, seed local database, and run tests.
