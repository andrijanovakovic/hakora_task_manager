const proxy = require("http-proxy-middleware");

module.exports = function(app) {
	app.use(proxy("/api", { target: "http://164.8.162.234:5555/" }));
};
