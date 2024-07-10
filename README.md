<img src="https://github.com/hexmax-nc/fe-voluntier/blob/main/assets/voluntierlogo.png?raw=true" width="40%" marginLeft="auto" marginRight="auto">

Voluntier is a mobile app developed by [Northcoders](https://northcoders.com/) Students as the final project of the [Software Development Bootcamp](https://northcoders.com/our-courses/skills-bootcamp-in-software-development). The app connects volunteers with charity organisations that need help.

**This is the backend API component of the project.**

## Running

### Setup .env files and install dependencies

1. Add a `.env.development` file to your root directory.

Download a ready-made one @ https://github.com/CoderMattGH/voluntier-docs/tree/main/be

2. Add a `.env.test` file to your root directory.

Download a ready-made one @ https://github.com/CoderMattGH/voluntier-docs/tree/main/be

3. `npm install`

### Available environment variables

- #### `PGDATABASE`

  _Database name._

  For example: `PGDATABASE=voluntier_db`

- #### `LOGL`

  _Log level. Can take values `debug`, `info`, `error`._

  For example: `LOGL=debug`

  _Note: If you would like to remove log messages, set the level to `error`._

### Setup database

1. Set up the psql databases:

   `npm run setup-dbs`

2. Compile the project:

   `npm run build`

3. Seed the database:

   `npm run seed`

### Compiling and running

1. Compile the project:

   `npm run build`

2. Run the project:

   `npm start`

## Testing

On first time, run `npm run prepare` to initialise `husky`.

Then:

`npm test`
