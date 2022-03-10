![mavi-server](https://raw.githubusercontent.com/m-emre-yalcin/mavi/main/public/brand.svg)

Create an abstracted and extendible server from one JSON file!

This module aims to lift repetitive works that you have made every time building a server from scratch.

`Important`: The package is still in development. I do not recommend to use in production. I have plans to make this module more user friendly and I am open to collaborations. You can [email](mailto:emrreyalcin@gmail.com) me or open an issue if you decided to contribute.

---

There are two ways to use this module.

## NPM module usage

`npm i mavi`

With the npm usage, you just have to define your server config inside of the `./index.js` and use `mavi start` script then you ready to go!

## Sub module usage

Clone this repository `https://github.com/m-emre-yalcin/mavi`
then `npm install` all the dependencies and `npm run build` to create the `dist` folder. Then in your `index.js` file, you can create the server with `require('./dist/index').createServer(serverConfig)` function. Then start your app with `nodemon index.js`.

---

## Example

The file below will create the entire server. You need to connect your database first then you can add some routes.

_Don't forget, the columns you choose on one route should be defined in your database too._

Define more populate options and middlewares to be able to use them in your routes.

An example server configuration file:

```js
const Package = require('./package.json')
module.exports = {
  poweredBy: 'Mavi v'.concat(Package.version),
  host: 'localhost',
  port: 3001,
  cors: {
    // Check the cors module for more options: https://www.npmjs.com/package/cors
    origin: [process.env.CLIENT_URL || 'http://localhost:3000', process.env.SERVER_URL || 'http://localhost:3001'],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ['x-access-token', 'x-refresh-token', 'token', 'content-type', 'accept'],
  },
  database: {
    development: {
      client: 'pg',
      connection: {
        database: process.env.DEV_DB_NAME,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASS,
      },
      pool: {
        min: 2,
        max: 10,
      },
      debug: true, // prints knex queries to console
    },
    production: {
      client: 'pg',
      connection: {
        database: process.env.PRO_DB_NAME,
        user: process.env.PRO_DB_USER,
        password: process.env.PRO_DB_PASS,
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
  },
  api: {
    base: '/api',
    routes: {
      posts: [
        {
          path: '/posts',
          method: 'get',
          controller: 'find',
          exclude: ['content'],
          populate: ['bookmark', 'user', 'community', 'thumbnail', 'responseCount'],
          middlewares: ['greetings'],
        },
        {
          path: '/posts/count',
          method: 'get',
          controller: 'count',
        },
        {
          path: '/posts/:id',
          method: 'get',
          controller: 'findOne',
          populate: ['bookmark', 'user', 'community', 'thumbnail', 'responseCount', 'tags'],
        },
        {
          path: '/posts/:id',
          method: 'put',
          controller: 'update',
          middlewares: ['is-owner'],
          populate: ['bookmark', 'user', 'community', 'thumbnail', 'responseCount', 'tags'],
        },
        {
          path: '/posts/:id',
          method: 'delete',
          controller: 'delete',
          middlewares: ['is-owner'],
        },
        {
          path: '/posts',
          method: 'post',
          controller: 'create',
          middlewares: ['authorization'],
          utils: ['detect-language'],
          populate: ['bookmark', 'user', 'community', 'thumbnail'],
        },
      ],
      uploads: [
        {
          path: '/uploads',
          method: 'get',
          serve: {
            folder: 'uploads',
            dotfiles: 'ignore',
            etag: false,
            extentsions: ['png', 'jpg', 'jpeg', 'gif', 'ico', 'svg'],
            maxAge: '1d',
          },
        },
        {
          path: '/uploads/list',
          method: 'get',
          controller: 'find',
        },
        {
          path: '/uploads/:id',
          method: 'get',
          controller: 'findOne',
          middlewares: ['is-owner'],
        },
        {
          path: '/uploads/:folder',
          method: 'post',
          controller: [
            'upload',
            {
              accept: 'image',
              folders: ['avatars', 'thumnail'],
              maxFileSize: 5242880, // bytes = 5mb
            },
          ],
          middlewares: ['authorization'],
        },
        {
          path: '/uploads/:id',
          method: 'put',
          controller: 'update',
          middlewares: ['is-owner'],
        },
      ],
      // This entity below uses views
      // Views are defined on the `define` property
      users: [
        {
          path: '/posts',
          method: 'get',
          view: 'avg_user_age',
        },
      ]
    },
    define: {
      // Models generates your database table and api responses
      // Api responses can be customized by the route configs
      models: {
        // an important note here: all the `hash` properties are automatically assigned if you put your models in the `models` folder and export with their name in index file
        // example models/index.js:
        // module.exports = {
        //   users: require('./users'),
        //   posts: require('./posts'),
        // }
        // but if you use them here, you should assign `hash` properties manually
        // after that, if you change table/column names or add new tables/columns, or change your column properties
        // mavi will update your database automatically on restart (if you using nodemon, it will update after you save it).
        // *** be careful if you drop/rename your hash property, dependent entity will be deleted entirely from your database (0.5.4 and previous versions) ***
        users: {
          id: {
            type: 'increments',
            constraints: ['primary'],
            hash: 'WzE2NDMyMTk4NjY1MDRddXNlcnMuaWQ',
          },
          username: {
            type: 'string',
            constraints: ['unique'],
            maxlength: 18,
            hash: 'WzE2NDMyMTk4Nzc0MjRddXNlcnMudXNlcm5hbWU',
          },
          email: {
            type: 'string',
            constraints: ['unique'],
            maxlength: 100,
            hash: 'WzE2NDMyMjA4Nzg4MDdddXNlcnMuZW1haWw',
          },
          age: {
            type: 'integer',
            hash: 'WzENDMjA4Nzg4MDdddXNlcnMuYWdl',
          },
          fullname: {
            type: 'string',
            maxlength: 100,
            hash: 'WzE2NDMyMjE0OTg0NzFdbXl1c2Vycy5mdWxsbmFtZQ',
          },
          password: {
            type: 'string',
            private: true,
            hash: 'WzE2NDMzOTk3MzA4MjJddXNlcnMucGFzc3dvcmQ',
          },
          bio: {
            type: 'string',
            maxlength: 255,
            hash: 'dXNlcnMuYmlv',
          },
          blocked: { type: 'boolean', default: false, hash: 'dXNlcnMuYmxvY2tlZA' },
          avatar: { type: 'string', hash: 'dXNlcnMuYXZhdGFy' },
          token: { type: 'text', private: true, hash: 'dXNlcnMudG9rZW4' },
          refresh: { type: 'text', private: true, hash: 'dXNlcnMucmVmcmVzaA' },
          updated_at: {
            type: 'timestamp',
            useTz: true,
            precision: 6,
            hash: 'dXNlcnMudXBkYXRlZF9hdA',
          },
          created_at: {
            type: 'timestamp',
            useTz: true,
            precision: 6,
            hash: 'dXNlcnMuY3JlYXRlZF9hdA',
          },
          hash: 'dXNlcnM',
        },
        posts: {
          id: {
            type: 'increments',
            constraints: ['primary'],
            hash: 'cG9zdHMuaWQ',
          },
          user: {
            type: 'integer',
            constraints: ['notNullable'],
            references: 'users.id', // this is the `id` property of the `users` model
            onDelete: 'cascade', // if you delete a user, all his posts will be deleted
            onUpdate: 'cascade', // if you update a user, all his posts will be updated
            comment: 'author',
            hash: 'cG9zdHMudXNlcg',
          },
          community: {
            type: 'integer',
            references: 'communities.id',
            hash: 'cG9zdHMuY29tbXVuaXR5',
          },
          title: {
            type: 'string',
            maxlength: 100,
            hash: 'cG9zdHMudGl0bGU',
          },
          published: {
            type: 'boolean',
            defaultTo: true,
            hash: 'cG9zdHMucHVibGlzaGVk',
          },
          content: {
            type: 'text',
            constraints: ['notNullable'],
            hash: 'cG9zdHMuY29udGVudA',
          },
          description: {
            type: 'string',
            maxlength: 300,
            hash: 'cG9zdHMuZGVzY3JpcHRpb24',
          },
          thumbnail: {
            type: 'integer',
            references: 'uploads.id',
            hash: 'cG9zdHMudGh1bWJuYWls',
          },
          tags: {
            type: 'string',
            hash: 'cG9zdHMudGFncw',
          },
          language: {
            type: 'string',
            constraints: ['notNullable'],
            hash: 'cG9zdHMubGFuZ3VhZ2U',
          },
          // if type is a timestamp and the column name includes `update`, date will be updated automatically on every update
          updated_at: {
            type: 'timestamp',
            useTz: true,
            precision: 6,
            hash: 'cG9zdHMudXBkYXRlZF9hdA',
          },
          // if type is a timestamp and the column name includes `create`, date will be created automatically on creation
          created_at: {
            type: 'timestamp',
            useTz: true,
            precision: 6,
            hash: 'cG9zdHMuY3JlYXRlZF9hdA',
          },
          hash: 'WzE2NDM1Nzg3NDYwNzBdcG9zdHM',
        },
        uploads: {
          id: {
            type: 'increments',
            constraints: ['primary'],
            hash: 'dXBsb2Fkcy5pZA',
          },
          url: {
            type: 'text',
            constraints: ['notNullable'],
            hash: 'dXBsb2Fkcy51cmw',
          },
          alt: { type: 'text', hash: 'dXBsb2Fkcy5hbHQ' },
          user: {
            type: 'integer',
            comment: 'Image owner',
            references: 'users.id',
            hash: 'dXBsb2Fkcy51c2Vy',
          },
          updated_at: {
            type: 'timestamp',
            useTz: true,
            precision: 6,
            hash: 'dXBsb2Fkcy51cGRhdGVkX2F0',
          },
          created_at: {
            type: 'timestamp',
            useTz: true,
            precision: 6,
            hash: 'dXBsb2Fkcy5jcmVhdGVkX2F0',
          },
          hash: 'dXBsb2Fkcw',
        },
      },
      // Seeds are automatically inserted into your database
      seeds: {
        posts: [
          {
            id: 1,
            user: 1,
            community: 1,
            title: 'Post 1',
            published: true,
            content: '<p>This is the first post</p>',
            description: 'This is the first post',
            thumbnail: 1,
            tags: '[1,2]',
            language: 'en',
            updated_at: '2022-01-01 00:00:00',
            created_at: '2022-01-01 00:00:00',
          },
        ],
      },
      // Populate configs are used in routes
      // There are different types of populates but none of them are standard. Will explain when they are ready.
      populate: {
        user: {
          select: 'user',
          from: 'users',
          type: 'object',
          columns: ['id', 'username', 'email', 'avatar', 'fullname', 'created_at'],
        },
        community: {
          select: 'community',
          from: 'communities',
          type: 'object',
          exclude: ['updated_at'],
          populate: ['icon'],
        },
        thumbnail: {
          select: 'thumbnail',
          from: 'uploads',
          type: 'object',
        },
        icon: {
          select: 'icon',
          from: 'uploads',
          type: 'object',
        },
        replyTo: {
          select: 'replyTo',
          from: 'threads',
          type: 'object',
          exclude: ['content', 'timestamps'],
        },
        responseTo: {
          select: 'responseTo',
          from: 'posts',
          type: 'object',
          columns: ['id', 'title', 'community', 'description'],
          populate: ['community'],
        },
        tags: {
          select: 'tags',
          from: 'tags',
          type: 'array-reference',
        },
        responseCount: {
          select: 'responseCount',
          on: 'responseTo',
          from: 'threads',
          type: 'count',
        },
        replyCount: {
          select: 'replyCount',
          on: 'replyTo',
          from: 'threads',
          type: 'count',
        },
        bookmark: {
          select: 'bookmark',
          from: 'bookmarks',
          on: 'references', // references = row.id
          on2: 'type', // type = tableName
          type: 'token-reference',
          returning: 'id', // '*' or spesific column
        },
      },
      // Middlewares are used in routes
      middlewares: {
        greetings: function (req, res, next) {
          console.log('Hello from middleware!')
          next()
        },
      },
      // Views are used in routes to extend controller methods.
      // Views will give the ability to make custom queries and can be combined with controllers.
      // Views are not intended to replace the actual views of the RDBMS (for now)
      views: {
        avg_user_age: (knex, params) => {
          // refer to this doc for the usage of knex: https://knexjs.org/
          // you can also return a raw sql string as well
          return knex.avg('age').from('users')
        },
      },
    },
  },
}
```

The Object above will generates a lot of things; from building your relational database to generate static/virtual api paths with the some default controllers or extended queries. This controllers also have a query building feature by default, like; you can do sort, filter, limit .etc. There are more stuffs, I will mention each one of them, but that requires some time. You can use the latest version and give it a try to see what it does :) If you encounter any problem, please open an issue or email me directly i will be happy to help you.

_this package is still in development_
