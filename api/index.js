// Vercel serverless function entry point
const { default: app } = require('../dist/app');
module.exports = app;