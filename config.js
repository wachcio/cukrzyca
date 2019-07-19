// config.js
const dotenv = require("dotenv");
require("dotenv").config();
const path = require("path");
const result = dotenv.config({
   path: path.join(__dirname, ".env")
});
if (result.error) {
   throw result.error;
}
const { parsed: envs } = result;

module.exports = envs;
