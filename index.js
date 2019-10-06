"use strict";
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new Koa();
const personalizationRouter = require("./routers/personalizationRouter");
const dbObjectManager = require("./infrastructure/dbObjectManager");
const config = require("./config");
const logManager = require("./infrastructure/logging/logManager");

app.use(bodyParser());

app
    .use(personalizationRouter.routes())
    .use(personalizationRouter.allowedMethods());

dbObjectManager.fetchAllDbs()
.then(() => {
    console.log("All connectionStrings were successful...");

    // Inicialización del servicio
    app.listen(config.port, () => {
        console.log("Server is up and running on port numner " + config.port);
    });
}, () => {
    console.log("Application not started because at least one connectionString was unsuccessful...");
})
.catch((error) => {
    logManager.logError("index", "dbObjectManager.fetchAllDbs", "" , error.message, "", error, "", "");
});