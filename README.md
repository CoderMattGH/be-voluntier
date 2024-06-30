## Style Guide

Please try and follow as closely as you can:

https://google.github.io/styleguide/tsguide.html

### Main points:

* Avoid default exports.
* Avoid redundant explicit type declaration.
* 100 character line limit.

## Running

### Setup .env files

1. Add a `.env.development` file to your root directory.

Download a ready-made one @ https://github.com/CoderMattGH/voluntier-docs/tree/main/be

2. Add a `.env.test` file to your root directory.

Download a ready-made one @ https://github.com/CoderMattGH/voluntier-docs/tree/main/be

3. `npm install`

### Available environment variables

* #### `PGDATABASE` 

  *Database name.*

  For example: `PGDATABASE=voluntier_db`


* #### `LOGL`  
  
  *Log level. Can take values `debug`, `info`, `error`.*

  For example: `LOGL=debug`

  *Note: If you would like to remove log messages, set the level to `error`.*


### Setup database

1. Set up the psql databases:

    `npm run setup-dbs`

2. Compile the project:

    `npm run build`

3. Seed the databases:

    `npm run seed`


### Compiling and running

1. Compile the project:

    `npm run build`

2. Run the project:

    `npm start`

**OR**

1. Compile and then run if successful:

    `./COMP_RUN.sh`

## Testing

`npm test`
