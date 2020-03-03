# LS Wunderlist 2.0 REST API

### [🕸 Deployed API](https://ls-wunderlist--production.herokuapp.com/api)

### [📑 Documentation](https://documenter.getpostman.com/view/10353629/SzKbLaoJ?version=latest)

#### Tech
* Node w/ Express
* PostgreSQL w/ Knexjs
* JWT authentication
* Jest/Supertest tests
* [Staging](https://ls-wunderlist--staging.herokuapp.com/api) and [Production](https://ls-wunderlist--production.herokuapp.com/api) apps deployed to Heroku

### Usage
You must have Postgres installed with databases  for `wunderlist` and `wunderlist_testing` created.

#### Run knex migrations
For development:
`knex migrate:latest`
For running tests:
`knex migrate:latest --env testing`

#### Run server
`npm run start`
#### Live reload server
`npm run server`

### Author
[Nolan Picini](https://github.com/NolanPic)