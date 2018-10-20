require('dotenv').config()
var config = require('12factor-config')

var cfg = config({
    host : {
        env      : 'APP_HOST',
        type     : 'string',
        default  : 'localhost',
        required : true,
    },
    port : {
        env      : 'APP_PORT',
        type     : 'integer',
        default  : '3000',
        required : true,
    },
    protocol : {
        env      : 'PROTOCOL',
        type     : 'string',
        default  : 'http',
        required : true,
    },
    dbHost : {
        env      : 'DB_HOST',
        type     : 'string',
        default  : 'cluster0-shard-00-00-o8ari.mongodb.net:27017,cluster0-shard-00-01-o8ari.mongodb.net:27017,cluster0-shard-00-02-o8ari.mongodb.net:27017',
        required : true,
    },
    dbPort : {
        env      : 'DB_PORT',
        type     : 'integer',
        default  : '27017',
        required : true,
    },
    dbUser : {
        env      : 'DB_USER',
        type     : 'string',
        default  : 'dev-wallet',
        required : true,
    },
    dbPassword : {
        env      : 'DB_PASSWORD',
        type     : 'string',
        default  : 'mVnrq8xAUCb0yJWo',
        required : true,
    },
    secret : {
        env      : 'SECRET',
        type     : 'string',
        default  : '99294354d37032fe545s37dc2dd3379e1d',
        required : true,
    },
    verifierSecret : {
        env      : 'VERIfIER_SECRET',
        type     : 'string',
        default  : '99294186737032fedadsca13fsdfhfdhfj',
        required : true,
    },
    env : {
      env      : 'NODE_ENV',
      type     : 'enum',
      default  : 'development',
      values   : ['development'],
    }
})

module.exports = cfg
