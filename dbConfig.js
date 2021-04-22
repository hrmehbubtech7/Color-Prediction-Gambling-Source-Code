const dbConfig = {};

dbConfig.mongoURI = {
  //development db
  development: process.env.DB_DEV,
  //testing db
  test: process.env.DB_DEV,
};

// config.secret = "0aJsVUtE2mXX58KsXYoC";

module.exports = dbConfig;
