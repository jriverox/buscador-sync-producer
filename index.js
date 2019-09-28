"use strict";
const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new koa();
const personalizationRouter = require("./routers/personalizationRouter");
const dbObjectManager = require("./infrastructure/dbObjectManager");
const config = require("./config");

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
    console.log("Catch in promise all");
    console.log(error);
});