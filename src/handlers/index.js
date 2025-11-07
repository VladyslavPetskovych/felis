function register(bot) {
  require("./admin").register(bot);
  require("./menu").register(bot);
  require("./promotions").register(bot);
  require("./delivery").register(bot);
  require("./language").register(bot);
  require("./feedback").register(bot);
  require("./contacts").register(bot);
  require("./lunches").register(bot);
  require("./phone").register(bot);
}

module.exports = { register };
