const { config } = require("dotenv");
config();

const SQLITE_URL = process.env.SQLITE_URL;

module.exports = { SQLITE_URL };
