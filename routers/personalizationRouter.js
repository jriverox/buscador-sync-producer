const Router = require("koa-router");
const personalizationRouter = new Router();
const SyncPersonalizationRequest = require("../models/syncPersonalizationRequest");
const PersonalizationService = require("../services/personalizationService");
const service = new PersonalizationService();

personalizationRouter.get("/personalization/:country/:campaign/:personalizationType", async (ctx) => {
    try {
        const request = new SyncPersonalizationRequest(
            ctx.params.country.toUpperCase(),
            ctx.params.campaign,
            ctx.params.personalizationType.toUpperCase()
        );

        await service.createJob(request);
        ctx.body = {
            sucess:"ok"
        }
    } catch (error) {
        console.log(error);
    }

});

module.exports = personalizationRouter;