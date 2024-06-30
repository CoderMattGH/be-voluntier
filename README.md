## Style Guide

Please try and follow as closely as you can:

https://google.github.io/styleguide/tsguide.html


## Running

### Setup .env files

1. Add a '.env.development' file to your root directory.

Download a ready-made one @ https://github.com/CoderMattGH/voluntier-docs/tree/main/be

2. Add a '.env.test' file to your root directory.

Download a ready-made one @ https://github.com/CoderMattGH/voluntier-docs/tree/main/be

3. `npm install`


### Setup database

1. Set up the psql databases:

`npm run setup-dbs`

2. Seed the databases:

`npm run seed`


### Finally

1. Compile the project:

`npm run build`

2. Run the project:

`npm start`

OR

1. Compile and then run if successful

`./COMP_RUN.sh`

## Testing

`npm test`
