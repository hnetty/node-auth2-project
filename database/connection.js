const knex = require('knex');


const knexfile = require('../knexfile.js');
const enviornment = process.env.NODE_ENV || 'development';

module.exports = knex(knexfile[enviornment]);