const serverlessExpress = require('vercel-serverless-express');
const app = require('../index');
module.exports = serverlessExpress({ app });