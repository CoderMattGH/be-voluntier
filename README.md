<img src="https://github.com/hexmax-nc/fe-voluntier/blob/main/assets/voluntierlogo.png?raw=true" width="40%" marginLeft="auto" marginRight="auto">

Voluntier is a mobile app developed by [Northcoders](https://northcoders.com/) Students as the final project of the [Software Development Bootcamp](https://northcoders.com/our-courses/skills-bootcamp-in-software-development). The app connects volunteers with charity organisations that need help.

**This is the backend API component of the project.**

### Developers who worked on the project:

[Tomasz](https://github.com/TomaszSarmata), [Lia](https://github.com/LiaPickles), [Tom](https://github.com/tomfollows), [Joseph](https://github.com/Joseph-Lee98), [Matt](https://github.com/CoderMattGH), [Joy](https://github.com/andothergames)

Take a look at the [frontend repo](https://github.com/CoderMattGH/fe-vountier)

---

## <img src="https://github.com/hexmax-nc/fe-voluntier/blob/main/assets/voluntier-badge.png?raw=true" width="14"> Tech Stack

Typescript, Node-postgres, Express.js, PostgreSQL.

---

## <img src="https://github.com/hexmax-nc/fe-voluntier/blob/main/assets/voluntier-badge.png?raw=true" width="14"> Installation & Running the App

### Requirements

For installation, you will need to have the following applications installed:

- `node.js` <i>[minimum version v21.6.2]</i>

  https://nodejs.org/en/download/package-manager

- `psql (PostgreSQL)` <i>[minimum version v16.2]</i>

  https://www.postgresql.org/download/

### Clone the repository

- Make a new directory and clone the repository by running the command:

  `git clone https://github.com/Joseph-Lee98/be-voluntier.git`

### Setup .env files and install dependencies

#### Available environment variables

- ##### `PGDATABASE`

  _Database name._

  For example: `PGDATABASE=voluntier_db`

- ##### `LOGL`

  _Log level. Can take values `debug`, `info`, `error`._

  For example: `LOGL=debug`

  _Note: If you would like to remove log messages, set the level to `error`._

- ##### `SECRET_KEY`

  _JSON Web Token (JWT) secret key_

  For example: `SECRET_KEY=keyboard-cat`

#### Instructions

1. Add a `.env.development` file to your root directory.

   For example:

   ```
   PGDATABASE=voluntier_db

   LOGL=debug

   SECRET_KEY=keyboard-cat
   ```

2. Add a `.env.test` file to your root directory.

   For example:

   ```
   PGDATABASE=voluntier_db_test

   LOGL=error

   SECRET_KEY=keyboard-cat
   ```

3. Add a `.env.production` file to your root directory if you are planning on hosting the API.

   For example:

   ```
   PGDATABASE=voluntier_db

   DATABASE_URL=postgres://username:password@db-hostname:5432/voluntier_db

   LOGL=error

   SECRET_KEY=keyboard-cat
   ```

4. `npm install`

### Setup database

1. Set up the psql databases:

   `npm run setup-dbs`

2. Compile the project:

   `npm run build`

3. Seed the database:

   `npm run seed`

### Running

1. Compile the project:

   `npm run build`

2. Run the project:

   `npm start`

## <img src="https://github.com/hexmax-nc/fe-voluntier/blob/main/assets/voluntier-badge.png?raw=true" width="14"> Testing

_Note: When testing for the first time, execute `npm run prepare` to initialise `husky`._

### Run all the test suites

`npm test`
