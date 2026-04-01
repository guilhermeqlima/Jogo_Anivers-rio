const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const app = require("./app");

setGlobalOptions({
  region: "southamerica-east1",
  maxInstances: 5,
});

exports.api = onRequest(app);
